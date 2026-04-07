interface VideoControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  peerCount: number;
  isCreatorOrAdmin: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
  onEndMeeting: () => void;
}

function ControlButton({
  active,
  danger,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const bg = danger
    ? 'rgba(239,68,68,0.15)'
    : active
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(239,68,68,0.15)';
  const border = danger
    ? 'rgba(239,68,68,0.3)'
    : active
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(239,68,68,0.3)';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color: danger ? '#ef4444' : active ? '#f0f0f5' : '#ef4444',
      }}
    >
      {children}
    </button>
  );
}

export default function VideoControlBar({
  audioEnabled,
  videoEnabled,
  screenSharing,
  peerCount,
  isCreatorOrAdmin,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
  onEndMeeting,
}: VideoControlBarProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      background: 'rgba(8,8,14,0.9)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '0 16px',
    }}>
      {/* Mic */}
      <ControlButton active={audioEnabled} onClick={onToggleMic} title={audioEnabled ? '마이크 끄기' : '마이크 켜기'}>
        {audioEnabled ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
            <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
            <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </ControlButton>

      {/* Camera */}
      <ControlButton active={videoEnabled} onClick={onToggleCamera} title={videoEnabled ? '카메라 끄기' : '카메라 켜기'}>
        {videoEnabled ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.88 3.549L7.12 20.451" />
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        )}
      </ControlButton>

      {/* Screen Share */}
      <ControlButton active={!screenSharing} onClick={onToggleScreenShare} title={screenSharing ? '화면 공유 중지' : '화면 공유'}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={screenSharing ? '#c9a96e' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </ControlButton>

      {/* Participant count */}
      <div style={{
        padding: '8px 14px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: '#8a8a9a',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
        {peerCount + 1}
      </div>

      {/* Leave */}
      <ControlButton danger onClick={onLeave} title="나가기">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </ControlButton>

      {/* End Meeting (creator/admin only) */}
      {isCreatorOrAdmin && (
        <button
          onClick={() => {
            if (window.confirm('회의를 종료하시겠습니까? 모든 참가자가 퇴장됩니다.')) {
              onEndMeeting();
            }
          }}
          title="회의 종료"
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          회의 종료
        </button>
      )}
    </div>
  );
}
