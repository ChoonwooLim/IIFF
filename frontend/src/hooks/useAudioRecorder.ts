import { useRef, useState, useCallback } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  clipCount: number;
  startRecording: (localStream: MediaStream, peerStreams: MediaStream[]) => void;
  stopRecording: () => Promise<void>;
  getFullRecording: () => Blob | null;
  clearClips: () => void;
}

/**
 * 회의 음성 녹음 훅
 * - Web Audio API로 로컬 + 모든 피어 오디오를 하나로 믹싱
 * - MediaRecorder로 webm/opus 형식 녹음
 * - 수동 모드: 여러 번 시작/정지 → 클립 누적 → getFullRecording()으로 합침
 * - 자동 모드: 한 번 시작 → 회의 종료 시 정지 → getFullRecording()
 */
export default function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [clipCount, setClipCount] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const clipsRef = useRef<Blob[]>([]); // accumulated clips
  const ctxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<MediaStreamAudioSourceNode[]>([]);
  const resolveStopRef = useRef<(() => void) | null>(null);
  const mimeRef = useRef('audio/webm');

  const cleanupSession = useCallback(() => {
    sourcesRef.current.forEach(s => s.disconnect());
    sourcesRef.current = [];
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close();
    }
    ctxRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = useCallback((localStream: MediaStream, peerStreams: MediaStream[]) => {
    if (recorderRef.current) return; // already recording

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const destination = ctx.createMediaStreamDestination();

    const allStreams = [localStream, ...peerStreams];
    for (const stream of allStreams) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) continue;
      const audioOnly = new MediaStream(audioTracks);
      const source = ctx.createMediaStreamSource(audioOnly);
      source.connect(destination);
      sourcesRef.current.push(source);
    }

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    mimeRef.current = mimeType;

    const recorder = new MediaRecorder(destination.stream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      if (chunksRef.current.length > 0) {
        const clip = new Blob(chunksRef.current, { type: mimeType });
        clipsRef.current.push(clip);
        setClipCount(clipsRef.current.length);
      }
      cleanupSession();
      if (resolveStopRef.current) {
        resolveStopRef.current();
        resolveStopRef.current = null;
      }
    };

    recorder.start(10000);
    setIsRecording(true);
  }, [cleanupSession]);

  const stopRecording = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (!recorderRef.current || recorderRef.current.state === 'inactive') {
        cleanupSession();
        setIsRecording(false);
        resolve();
        return;
      }
      resolveStopRef.current = resolve;
      recorderRef.current.stop();
      setIsRecording(false);
    });
  }, [cleanupSession]);

  /** 모든 누적 클립을 하나의 Blob으로 합침 */
  const getFullRecording = useCallback((): Blob | null => {
    if (clipsRef.current.length === 0) return null;
    return new Blob(clipsRef.current, { type: mimeRef.current });
  }, []);

  const clearClips = useCallback(() => {
    clipsRef.current = [];
    setClipCount(0);
  }, []);

  return { isRecording, clipCount, startRecording, stopRecording, getFullRecording, clearClips };
}
