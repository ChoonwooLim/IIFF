import { useState, useEffect } from 'react';

interface DeviceInfo {
  deviceId: string;
  label: string;
}

interface DeviceSettingsModalProps {
  currentCameraId: string;
  currentMicId: string;
  onChangeCamera: (deviceId: string) => void;
  onChangeMic: (deviceId: string) => void;
  onClose: () => void;
}

export default function DeviceSettingsModal({
  currentCameraId,
  currentMicId,
  onChangeCamera,
  onChangeMic,
  onClose,
}: DeviceSettingsModalProps) {
  const [cameras, setCameras] = useState<DeviceInfo[]>([]);
  const [mics, setMics] = useState<DeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<DeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState(currentCameraId);
  const [selectedMic, setSelectedMic] = useState(currentMicId);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setCameras(devices.filter(d => d.kind === 'videoinput').map(d => ({
        deviceId: d.deviceId, label: d.label || `카메라 ${d.deviceId.slice(0, 4)}`,
      })));
      setMics(devices.filter(d => d.kind === 'audioinput').map(d => ({
        deviceId: d.deviceId, label: d.label || `마이크 ${d.deviceId.slice(0, 4)}`,
      })));
      setSpeakers(devices.filter(d => d.kind === 'audiooutput').map(d => ({
        deviceId: d.deviceId, label: d.label || `스피커 ${d.deviceId.slice(0, 4)}`,
      })));
    });
  }, []);

  const handleApply = () => {
    if (selectedCamera !== currentCameraId) onChangeCamera(selectedCamera);
    if (selectedMic !== currentMicId) onChangeMic(selectedMic);
    onClose();
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f0f0f5', fontSize: 13, outline: 'none',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          width: '100%', maxWidth: 420,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f5' }}>디바이스 설정</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#5a5a6a', fontSize: 20, cursor: 'pointer',
          }}>&times;</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Camera */}
          <div>
            <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              카메라
            </label>
            <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} style={selectStyle}>
              {cameras.length === 0 && <option>카메라 없음</option>}
              {cameras.map(c => <option key={c.deviceId} value={c.deviceId}>{c.label}</option>)}
            </select>
          </div>

          {/* Microphone */}
          <div>
            <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
              </svg>
              마이크
            </label>
            <select value={selectedMic} onChange={e => setSelectedMic(e.target.value)} style={selectStyle}>
              {mics.length === 0 && <option>마이크 없음</option>}
              {mics.map(m => <option key={m.deviceId} value={m.deviceId}>{m.label}</option>)}
            </select>
          </div>

          {/* Speaker */}
          <div>
            <label style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              스피커
            </label>
            <select style={selectStyle}>
              {speakers.length === 0 && <option>기본 스피커</option>}
              {speakers.map(s => <option key={s.deviceId} value={s.deviceId}>{s.label}</option>)}
            </select>
            <button
              onClick={() => {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => {
                  // Create a simple beep
                  const ctx = new AudioContext();
                  const osc = ctx.createOscillator();
                  osc.frequency.value = 440;
                  osc.connect(ctx.destination);
                  osc.start();
                  setTimeout(() => { osc.stop(); ctx.close(); }, 300);
                });
              }}
              style={{
                marginTop: 8, padding: '6px 14px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#8a8a9a', fontSize: 12, cursor: 'pointer',
              }}
            >
              스피커 테스트
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 28 }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8a8a9a', fontSize: 13, cursor: 'pointer',
          }}>
            취소
          </button>
          <button onClick={handleApply} style={{
            padding: '10px 20px', borderRadius: 8,
            background: 'rgba(201,169,110,0.2)',
            border: '1px solid rgba(201,169,110,0.4)',
            color: '#c9a96e', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
