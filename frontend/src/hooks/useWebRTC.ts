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
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  peers: Map<number, PeerState>;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  error: string | null;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => Promise<void>;
  disconnect: () => void;
}

export default function useWebRTC(meetingId: number, password?: string): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<number, PeerState>>(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const myUserIdRef = useRef<number>(0);

  // Create peer connection for a specific user
  const createPeerConnection = useCallback((userId: number, userInfo: { id: number; nickname: string; profile_image: string | null }) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcsRef.current.set(userId, pc);

    // Add local tracks to the connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          target_user_id: userId,
          candidate: event.candidate.toJSON(),
        }));
      }
    };

    // Handle remote stream
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

  // Send offer to a peer
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

  // Handle signaling messages
  const handleSignalingMessage = useCallback(async (data: Record<string, unknown>) => {
    const type = data.type as string;

    if (type === 'room-joined') {
      const user = data.user as { id: number; nickname: string; profile_image: string | null };
      const existingPeers = data.peers as Array<{ id: number; nickname: string; profile_image: string | null }>;
      myUserIdRef.current = user.id;

      // Send offers to all existing peers (new joiner initiates)
      for (const peer of existingPeers) {
        await sendOffer(peer.id, peer);
      }
    }

    else if (type === 'peer-joined') {
      const user = data.user as { id: number; nickname: string; profile_image: string | null };
      // Add peer placeholder — they will send us an offer
      setPeers((prev) => {
        const next = new Map(prev);
        next.set(user.id, {
          userId: user.id,
          nickname: user.nickname,
          profileImage: user.profile_image,
          stream: null,
          videoEnabled: true,
          audioEnabled: true,
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
  }, [sendOffer, createPeerConnection]);

  // Initialize media and WebSocket
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Get local media
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        // Try audio only
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          setVideoEnabled(false);
          setError('카메라 접근 불가 — 오디오만 사용합니다');
        } catch {
          setError('카메라와 마이크 접근 불가 — 시청 전용 모드');
        }
      }

      if (cancelled) {
        stream?.getTracks().forEach((t) => t.stop());
        return;
      }

      if (stream) {
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

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleSignalingMessage(data);
      };

      ws.onclose = (event) => {
        if (!cancelled && event.code !== 1000) {
          const reasons: Record<number, string> = {
            4001: '인증 토큰이 필요합니다',
            4003: '인증 실패',
            4004: '회의를 찾을 수 없습니다',
            4005: '화상 회의가 아닙니다',
            4006: '접근 권한이 없습니다',
          };
          setError(reasons[event.code] || '연결이 끊어졌습니다');
        }
      };
    }

    init();

    return () => {
      cancelled = true;
      // Cleanup
      wsRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcsRef.current.forEach((pc) => pc.close());
      pcsRef.current.clear();
    };
  }, [meetingId, password, handleSignalingMessage]);

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
      // Stop screen sharing, restore camera
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

        // Replace video track in all peer connections
        pcsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });

        // Handle user stopping share via browser UI
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

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcsRef.current.forEach((pc) => pc.close());
    pcsRef.current.clear();
    setPeers(new Map());
    setLocalStream(null);
  }, []);

  return {
    localStream,
    peers,
    videoEnabled,
    audioEnabled,
    screenSharing,
    error,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    disconnect,
  };
}
