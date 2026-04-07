interface VideoControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  peerCount: number;
  isCreatorOrAdmin: boolean;
  showChat: boolean;
  showParticipants: boolean;
  chatUnread: number;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleHandRaise: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onOpenSettings: () => void;
  onToggleFullscreen: () => void;
  onLeave: () => void;
  onEndMeeting: () => void;
}

function ControlButton({
  active,
  danger,
  highlight,
  badge,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  highlight?: boolean;
  badge?: number;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const bg = danger
    ? 'rgba(239,68,68,0.15)'
    : highlight
    ? 'rgba(201,169,110,0.2)'
    : active
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(239,68,68,0.15)';
  const border = danger
    ? 'rgba(239,68,68,0.3)'
    : highlight
    ? 'rgba(201,169,110,0.4)'
    : active
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(239,68,68,0.3)';
  const color = danger
    ? '#ef4444'
    : highlight
    ? '#c9a96e'
    : active
    ? '#f0f0f5'
    : '#ef4444';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: 'relative',
        width: 44,
        height: 44,
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color,
        flexShrink: 0,
      }}
    >
      {children}
      {badge && badge > 0 ? (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          minWidth: 18, height: 18, borderRadius: 9,
          background: '#ef4444', color: '#fff',
          fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px',
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
}

export default function VideoControlBar({
  audioEnabled,
  videoEnabled,
  screenSharing,
  handRaised,
  peerCount,
  isCreatorOrAdmin,
  showChat,
  showParticipants,
  chatUnread,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleHandRaise,
  onToggleChat,
  onToggleParticipants,
  onOpenSettings,
  onToggleFullscreen,
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
      background: 'rgba(8,8,14,0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '0 16px',
    }}>
      {/* Left group: media controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
        <ControlButton active={!screenSharing} highlight={screenSharing} onClick={onToggleScreenShare} title={screenSharing ? '화면 공유 중지' : '화면 공유'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={screenSharing ? '#c9a96e' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </ControlButton>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* Center group: interaction */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Hand Raise */}
        <ControlButton
          active={!handRaised}
          highlight={handRaised}
          onClick={onToggleHandRaise}
          title={handRaised ? '손 내리기' : '손들기'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a1 1 0 00-2 0" />
            <path d="M14 10V4a1 1 0 00-2 0v6" />
            <path d="M10 10.5V6a1 1 0 00-2 0v8" />
            <path d="M18 8a1 1 0 012 0v7a7 7 0 01-14 0v-2c0-.6.4-1 1-1h0c.6 0 1 .4 1 1v0" />
          </svg>
        </ControlButton>

        {/* Chat */}
        <ControlButton
          active={!showChat}
          highlight={showChat}
          badge={showChat ? 0 : chatUnread}
          onClick={onToggleChat}
          title="채팅"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </ControlButton>

        {/* Participants */}
        <ControlButton
          active={!showParticipants}
          highlight={showParticipants}
          onClick={onToggleParticipants}
          title="참가자"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </ControlButton>

        {/* Participant count badge */}
        <div style={{
          padding: '6px 12px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: 13,
          color: '#8a8a9a',
          flexShrink: 0,
        }}>
          {peerCount + 1}명
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* Right group: settings & exit */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Settings */}
        <ControlButton active onClick={onOpenSettings} title="디바이스 설정">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </ControlButton>

        {/* Fullscreen */}
        <ControlButton active onClick={onToggleFullscreen} title="전체화면">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </ControlButton>

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
              padding: '8px 14px',
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            회의 종료
          </button>
        )}
      </div>
    </div>
  );
}
