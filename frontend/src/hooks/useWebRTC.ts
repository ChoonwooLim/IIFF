import { useRef, useState, useCallback, useEffect } from 'react';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export interface PeerState {
  userId: number;
  nickname: string;
  profileImage: string | null;
  stream: MediaStream | null;
  videoEnabled: boolean;
  audioEnabled: boolean;
  handRaised: boolean;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface JoinSettings {
  audioDeviceId?: string;
  videoDeviceId?: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  peers: Map<number, PeerState>;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  currentCameraId: string;
  currentMicId: string;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => Promise<void>;
  toggleHandRaise: () => void;
  changeCamera: (deviceId: string) => Promise<void>;
  changeMic: (deviceId: string) => Promise<void>;
  disconnect: () => void;
}

export default function useWebRTC(
  meetingId: number,
  password?: string,
  joinSettings?: JoinSettings | null,
): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<number, PeerState>>(new Map());
  const [videoEnabled, setVideoEnabled] = useState(joinSettings?.videoEnabled ?? true);
  const [audioEnabled, setAudioEnabled] = useState(joinSettings?.audioEnabled ?? true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [currentCameraId, setCurrentCameraId] = useState(joinSettings?.videoDeviceId || '');
  const [currentMicId, setCurrentMicId] = useState(joinSettings?.audioDeviceId || '');

  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const myUserIdRef = useRef<number>(0);
  const joinSettingsRef = useRef(joinSettings);
  joinSettingsRef.current = joinSettings;

  // Don't initialize if joinSettings is null (pre-join phase)
  const shouldConnect = joinSettings !== null;

  const createPeerConnection = useCallback((userId: number, userInfo: { id: number; nickname: string; profile_image: string | null }) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcsRef.current.set(userId, pc);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          target_user_id: userId,
          candidate: event.candidate.toJSON(),
        }));
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setPeers((prev) => {
        const next = new Map(prev);
        const existing = next.get(userId);
        next.set(userId, {
          userId,
          nickname: existing?.nickname || userInfo.nickname,
          profileImage: existing?.profileImage ?? userInfo.profile_image,
          stream: remoteStream,
          videoEnabled: existing?.videoEnabled ?? true,
          audioEnabled: existing?.audioEnabled ?? true,
          handRaised: existing?.handRaised ?? false,
        });
        return next;
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        pc.close();
        pcsRef.current.delete(userId);
      }
    };

    return pc;
  }, []);

  const sendOffer = useCallback(async (userId: number, userInfo: { id: number; nickname: string; profile_image: string | null }) => {
    const pc = createPeerConnection(userId, userInfo);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'offer',
        target_user_id: userId,
        sdp: pc.localDescription?.toJSON(),
      }));
    }
  }, [createPeerConnection]);

  const handleSignalingMessage = useCallback(async (data: Record<string, unknown>) => {
    const type = data.type as string;

    if (type === 'room-joined') {
      const user = data.user as { id: number; nickname: string; profile_image: string | null };
      const existingPeers = data.peers as Array<{ id: number; nickname: string; profile_image: string | null }>;
      myUserIdRef.current = user.id;
      setConnectionStatus('connected');

      for (const peer of existingPeers) {
        await sendOffer(peer.id, peer);
      }
    }

    else if (type === 'peer-joined') {
      const user = data.user as { id: number; nickname: string; profile_image: string | null };
      setPeers((prev) => {
        const next = new Map(prev);
        next.set(user.id, {
          userId: user.id,
          nickname: user.nickname,
          profileImage: user.profile_image,
          stream: null,
          videoEnabled: true,
          audioEnabled: true,
          handRaised: false,
        });
        return next;
      });
    }

    else if (type === 'peer-left') {
      const user = data.user as { id: number };
      const pc = pcsRef.current.get(user.id);
      if (pc) {
        pc.close();
        pcsRef.current.delete(user.id);
      }
      setPeers((prev) => {
        const next = new Map(prev);
        next.delete(user.id);
        return next;
      });
    }

    else if (type === 'offer') {
      const fromUser = data.from_user as { id: number; nickname: string; profile_image: string | null };
      const sdp = data.sdp as RTCSessionDescriptionInit;
      const pc = createPeerConnection(fromUser.id, fromUser);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          target_user_id: fromUser.id,
          sdp: pc.localDescription?.toJSON(),
        }));
      }
    }

    else if (type === 'answer') {
      const fromUser = data.from_user as { id: number };
      const sdp = data.sdp as RTCSessionDescriptionInit;
      const pc = pcsRef.current.get(fromUser.id);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    }

    else if (type === 'ice-candidate') {
      const fromUser = data.from_user as { id: number };
      const candidate = data.candidate as RTCIceCandidateInit;
      const pc = pcsRef.current.get(fromUser.id);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }

    else if (type === 'media-state') {
      const userId = data.user_id as number;
      setPeers((prev) => {
        const next = new Map(prev);
        const existing = next.get(userId);
        if (existing) {
          next.set(userId, {
            ...existing,
            videoEnabled: data.video as boolean,
            audioEnabled: data.audio as boolean,
          });
        }
        return next;
      });
    }

    else if (type === 'hand-raise') {
      const userId = data.user_id as number;
      const raised = data.raised as boolean;
      setPeers((prev) => {
        const next = new Map(prev);
        const existing = next.get(userId);
        if (existing) {
          next.set(userId, { ...existing, handRaised: raised });
        }
        return next;
      });
    }
  }, [sendOffer, createPeerConnection]);

  // Initialize media and WebSocket
  useEffect(() => {
    if (!shouldConnect) return;

    let cancelled = false;
    const settings = joinSettingsRef.current;

    async function init() {
      let stream: MediaStream | null = null;
      const videoConstraints = settings?.videoDeviceId
        ? { deviceId: { exact: settings.videoDeviceId } }
        : true;
      const audioConstraints = settings?.audioDeviceId
        ? { deviceId: { exact: settings.audioDeviceId } }
        : true;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: (settings?.videoEnabled !== false) ? videoConstraints : false,
          audio: audioConstraints,
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: audioConstraints });
          setVideoEnabled(false);
        } catch {
          setError('카메라와 마이크 접근 불가 — 시청 전용 모드');
        }
      }

      if (cancelled) {
        stream?.getTracks().forEach((t) => t.stop());
        return;
      }

      if (stream) {
        // Apply initial toggle state
        if (settings?.audioEnabled === false) {
          stream.getAudioTracks().forEach(t => { t.enabled = false; });
          setAudioEnabled(false);
        }
        if (settings?.videoEnabled === false) {
          stream.getVideoTracks().forEach(t => { t.enabled = false; });
          setVideoEnabled(false);
        }

        // Track device IDs
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        if (videoTrack) setCurrentCameraId(videoTrack.getSettings().deviceId || '');
        if (audioTrack) setCurrentMicId(audioTrack.getSettings().deviceId || '');

        localStreamRef.current = stream;
        setLocalStream(stream);
      }

      // Connect WebSocket
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('로그인이 필요합니다');
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      let url = `${protocol}//${host}/ws/video/${meetingId}?token=${token}`;
      if (password) url += `&password=${encodeURIComponent(password)}`;

      setConnectionStatus('connecting');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleSignalingMessage(data);
      };

      ws.onclose = (event) => {
        if (!cancelled) {
          setConnectionStatus('disconnected');
          if (event.code !== 1000) {
            const reasons: Record<number, string> = {
              4001: '인증 토큰이 필요합니다',
              4003: '인증 실패',
              4004: '회의를 찾을 수 없습니다',
              4005: '화상 회의가 아닙니다',
              4006: '접근 권한이 없습니다',
            };
            setError(reasons[event.code] || '연결이 끊어졌습니다');
          }
        }
      };

      ws.onerror = () => {
        if (!cancelled) setConnectionStatus('disconnected');
      };
    }

    init();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcsRef.current.forEach((pc) => pc.close());
      pcsRef.current.clear();
    };
  }, [meetingId, password, shouldConnect, handleSignalingMessage]);

  // Cleanup on browser close
  useEffect(() => {
    const onBeforeUnload = () => {
      wsRef.current?.close();
      pcsRef.current.forEach((pc) => pc.close());
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
      wsRef.current?.send(JSON.stringify({
        type: 'media-state',
        audio: audioTrack.enabled,
        video: videoEnabled,
      }));
    }
  }, [videoEnabled]);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
      wsRef.current?.send(JSON.stringify({
        type: 'media-state',
        video: videoTrack.enabled,
        audio: audioEnabled,
      }));
    }
  }, [audioEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (screenSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) {
        pcsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          sender?.replaceTrack(cameraTrack);
        });
      }
      setScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        pcsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });

        screenTrack.onended = () => {
          const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
          if (cameraTrack) {
            pcsRef.current.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
              sender?.replaceTrack(cameraTrack);
            });
          }
          screenStreamRef.current = null;
          setScreenSharing(false);
        };

        setScreenSharing(true);
      } catch {
        // User cancelled screen share picker
      }
    }
  }, [screenSharing]);

  const toggleHandRaise = useCallback(() => {
    const newState = !handRaised;
    setHandRaised(newState);
    wsRef.current?.send(JSON.stringify({
      type: 'hand-raise',
      raised: newState,
    }));
  }, [handRaised]);

  const changeCamera = useCallback(async (deviceId: string) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      const newTrack = newStream.getVideoTracks()[0];

      // Replace in local stream
      const oldTrack = localStreamRef.current?.getVideoTracks()[0];
      if (oldTrack && localStreamRef.current) {
        localStreamRef.current.removeTrack(oldTrack);
        oldTrack.stop();
        localStreamRef.current.addTrack(newTrack);
      }

      // Replace in all peer connections
      pcsRef.current.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
        sender?.replaceTrack(newTrack);
      });

      setCurrentCameraId(deviceId);
      setLocalStream(localStreamRef.current ? new MediaStream(localStreamRef.current.getTracks()) : null);
    } catch {
      // Device change failed
    }
  }, []);

  const changeMic = useCallback(async (deviceId: string) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
      const newTrack = newStream.getAudioTracks()[0];

      const oldTrack = localStreamRef.current?.getAudioTracks()[0];
      if (oldTrack && localStreamRef.current) {
        localStreamRef.current.removeTrack(oldTrack);
        oldTrack.stop();
        localStreamRef.current.addTrack(newTrack);
      }

      pcsRef.current.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'audio');
        sender?.replaceTrack(newTrack);
      });

      setCurrentMicId(deviceId);
    } catch {
      // Device change failed
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcsRef.current.forEach((pc) => pc.close());
    pcsRef.current.clear();
    setPeers(new Map());
    setLocalStream(null);
    setConnectionStatus('disconnected');
  }, []);

  return {
    localStream,
    peers,
    videoEnabled,
    audioEnabled,
    screenSharing,
    handRaised,
    error,
    connectionStatus,
    currentCameraId,
    currentMicId,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    toggleHandRaise,
    changeCamera,
    changeMic,
    disconnect,
  };
}
