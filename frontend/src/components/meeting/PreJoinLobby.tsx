import { useState, useEffect, useRef, useCallback } from 'react';

interface DeviceInfo {
  deviceId: string;
  label: string;
}

interface PreJoinLobbyProps {
  meetingName: string;
  onJoin: (settings: {
    audioDeviceId: string;
    videoDeviceId: string;
    audioEnabled: boolean;
    videoEnabled: boolean;
  }) => void;
  onCancel: () => void;
}

export default function PreJoinLobby({ meetingName, onJoin, onCancel }: PreJoinLobbyProps) {
  const [cameras, setCameras] = useState<DeviceInfo[]>([]);
  const [mics, setMics] = useState<DeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<DeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [speakerTesting, setSpeakerTesting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Enumerate devices
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(d => d.kind === 'videoinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `카메라 ${d.deviceId.slice(0, 4)}` }));
      const audioDevices = devices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `마이크 ${d.deviceId.slice(0, 4)}` }));
      const outputDevices = devices
        .filter(d => d.kind === 'audiooutput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `스피커 ${d.deviceId.slice(0, 4)}` }));
      setCameras(videoDevices);
      setMics(audioDevices);
      setSpeakers(outputDevices);
      if (videoDevices.length > 0 && !selectedCamera) setSelectedCamera(videoDevices[0].deviceId);
      if (audioDevices.length > 0 && !selectedMic) setSelectedMic(audioDevices[0].deviceId);
      if (outputDevices.length > 0 && !selectedSpeaker) setSelectedSpeaker(outputDevices[0].deviceId);
    } catch {
      setError('디바이스 목록을 가져올 수 없습니다');
    }
  }, [selectedCamera, selectedMic]);

  // Get preview stream
  const getPreviewStream = useCallback(async (camId: string, micId: string) => {
    // Stop existing
    stream?.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;

    const constraints: MediaStreamConstraints = {
      video: videoEnabled && camId ? { deviceId: { exact: camId } } : false,
      audio: micId ? { deviceId: { exact: micId } } : true,
    };

    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      setError('');

      // Audio level meter
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(s);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Re-enumerate to get labels
      await enumerateDevices();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('카메라/마이크 접근 권한이 필요합니다');
      } else {
        setError('디바이스를 사용할 수 없습니다');
      }
    }
  }, [videoEnabled, enumerateDevices]);

  // Initial setup
  useEffect(() => {
    (async () => {
      // Request permission first
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        tempStream.getTracks().forEach(t => t.stop());
      } catch {
        // Try audio only
        try {
          const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          tempStream.getTracks().forEach(t => t.stop());
          setVideoEnabled(false);
        } catch {
          setError('카메라와 마이크 접근이 거부되었습니다');
          await enumerateDevices();
          return;
        }
      }
      await enumerateDevices();
    })();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Start preview when devices are selected
  useEffect(() => {
    if (selectedCamera || selectedMic) {
      getPreviewStream(selectedCamera, selectedMic);
    }
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [selectedCamera, selectedMic]);

  // Attach video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Audio level animation
  useEffect(() => {
    const updateLevel = () => {
      if (analyserRef.current && audioEnabled) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg / 255);
      } else {
        setAudioLevel(0);
      }
      animFrameRef.current = requestAnimationFrame(updateLevel);
    };
    animFrameRef.current = requestAnimationFrame(updateLevel);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [audioEnabled]);

  // Toggle mic
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => { t.enabled = !audioEnabled; });
    }
    setAudioEnabled(!audioEnabled);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = !videoEnabled; });
    }
    setVideoEnabled(!videoEnabled);
  };

  const handleJoin = () => {
    // Stop preview stream before joining (useWebRTC will create its own)
    stream?.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    onJoin({
      audioDeviceId: selectedMic,
      videoDeviceId: selectedCamera,
      audioEnabled,
      videoEnabled,
    });
  };

  return (
    <div className="top-14 md:top-[72px]" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0,
      zIndex: 40, background: '#05050a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 720,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f0f0f5', marginBottom: 4 }}>
            {meetingName || '화상 회의'}
          </h2>
          <p style={{ fontSize: 13, color: '#6a6a7a' }}>입장 전 카메라와 마이크를 확인하세요</p>
        </div>

        {/* Preview + Settings */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Video Preview */}
          <div style={{
            width: 400, maxWidth: '100%', aspectRatio: '4/3',
            background: '#0a0a14', borderRadius: 12,
            overflow: 'hidden', position: 'relative',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {stream && videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(201,169,110,0.15)',
                  border: '2px solid rgba(201,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M16.88 3.549L7.12 20.451" />
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: '#5a5a6a' }}>카메라 꺼짐</span>
              </div>
            )}

            {/* Audio level bar */}
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: audioLevel > 0.02 ? '#4ade80' : 'rgba(255,255,255,0.1)',
                width: `${Math.min(audioLevel * 100 * 3, 100)}%`,
                transition: 'width 0.1s',
              }} />
            </div>

            {/* Quick toggles on preview */}
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              display: 'flex', gap: 8,
            }}>
              <button onClick={toggleMic} style={{
                width: 40, height: 40, borderRadius: 10,
                background: audioEnabled ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.2)',
                border: `1px solid ${audioEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.3)'}`,
                color: audioEnabled ? '#f0f0f5' : '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                {audioEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
                  </svg>
                )}
              </button>
              <button onClick={toggleCamera} style={{
                width: 40, height: 40, borderRadius: 10,
                background: videoEnabled ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.2)',
                border: `1px solid ${videoEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.3)'}`,
                color: videoEnabled ? '#f0f0f5' : '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                {videoEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16.88 3.549L7.12 20.451" />
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Device Settings */}
          <div style={{
            flex: '1 1 240px', minWidth: 240,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {/* Camera select */}
            <div>
              <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'block' }}>
                카메라
              </label>
              <select
                value={selectedCamera}
                onChange={e => setSelectedCamera(e.target.value)}
                disabled={cameras.length === 0}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#f0f0f5', fontSize: 13, outline: 'none',
                }}
              >
                {cameras.length === 0 && <option>카메라 없음</option>}
                {cameras.map(c => (
                  <option key={c.deviceId} value={c.deviceId}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Mic select */}
            <div>
              <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'block' }}>
                마이크
              </label>
              <select
                value={selectedMic}
                onChange={e => setSelectedMic(e.target.value)}
                disabled={mics.length === 0}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#f0f0f5', fontSize: 13, outline: 'none',
                }}
              >
                {mics.length === 0 && <option>마이크 없음</option>}
                {mics.map(m => (
                  <option key={m.deviceId} value={m.deviceId}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Audio level indicator */}
            <div>
              <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'block' }}>
                마이크 테스트
              </label>
              <div style={{
                display: 'flex', gap: 3, height: 24, alignItems: 'flex-end',
                padding: '4px 12px',
                background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, borderRadius: 1,
                    background: i / 20 < audioLevel * 3
                      ? (i < 14 ? '#4ade80' : i < 17 ? '#facc15' : '#ef4444')
                      : 'rgba(255,255,255,0.06)',
                    height: `${40 + (i / 20) * 60}%`,
                    transition: 'background 0.1s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#5a5a6a', marginTop: 4 }}>
                {audioEnabled
                  ? audioLevel > 0.02 ? '마이크가 정상 작동합니다' : '말을 하면 레벨이 움직입니다'
                  : '마이크가 음소거 상태입니다'
                }
              </p>
            </div>

            {/* Speaker select + test */}
            <div>
              <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'block' }}>
                스피커
              </label>
              <select
                value={selectedSpeaker}
                onChange={e => setSelectedSpeaker(e.target.value)}
                disabled={speakers.length === 0}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#f0f0f5', fontSize: 13, outline: 'none',
                }}
              >
                {speakers.length === 0 && <option>기본 스피커</option>}
                {speakers.map(s => (
                  <option key={s.deviceId} value={s.deviceId}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  setSpeakerTesting(true);
                  try {
                    const ctx = new AudioContext();
                    // Play a pleasant test tone sequence
                    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
                    for (let i = 0; i < notes.length; i++) {
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.type = 'sine';
                      osc.frequency.value = notes[i];
                      gain.gain.value = 0.15;
                      gain.gain.setTargetAtTime(0, ctx.currentTime + i * 0.25 + 0.2, 0.05);
                      osc.connect(gain);
                      gain.connect(ctx.destination);
                      osc.start(ctx.currentTime + i * 0.25);
                      osc.stop(ctx.currentTime + i * 0.25 + 0.3);
                    }
                    setTimeout(() => { ctx.close(); setSpeakerTesting(false); }, 1200);
                  } catch {
                    setSpeakerTesting(false);
                  }
                }}
                disabled={speakerTesting}
                style={{
                  marginTop: 8, padding: '8px 16px', borderRadius: 8, width: '100%',
                  background: speakerTesting ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${speakerTesting ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: speakerTesting ? '#4ade80' : '#8a8a9a',
                  fontSize: 12, cursor: speakerTesting ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {speakerTesting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                    재생 중...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                    스피커 테스트
                  </>
                )}
              </button>
              <p style={{ fontSize: 11, color: '#5a5a6a', marginTop: 4 }}>
                {speakerTesting ? '테스트 소리가 들리면 스피커가 정상입니다' : '버튼을 눌러 소리가 나는지 확인하세요'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '8px 12px', borderRadius: 8,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: 12,
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '12px 28px', borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8a8a9a', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            취소
          </button>
          <button onClick={handleJoin} style={{
            padding: '12px 40px', borderRadius: 10,
            background: 'rgba(201,169,110,0.2)',
            border: '1px solid rgba(201,169,110,0.4)',
            color: '#c9a96e', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}>
            회의 입장
          </button>
        </div>
      </div>
    </div>
  );
}
