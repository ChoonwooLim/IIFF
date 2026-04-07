import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/hooks/useNotifications';

interface Props {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

function ToastItem({ notification, onRemove }: { notification: Notification; onRemove: () => void }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in on next frame
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onRemove, 300);
  };

  if (notification.type === 'meeting_invite') {
    const { inviter_name, meeting_name, meeting_id, meeting_type, password } =
      notification.data as {
        inviter_name?: string;
        meeting_name?: string;
        meeting_id?: number;
        meeting_type?: string;
        password?: string | null;
      };

    const handleJoin = () => {
      const base = meeting_type === 'video'
        ? `/meetings/video/${meeting_id}`
        : `/meetings/chat/${meeting_id}`;
      const url = password ? `${base}?password=${encodeURIComponent(password)}` : base;
      handleClose();
      navigate(url);
    };

    return (
      <div
        style={{
          transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          background: 'linear-gradient(135deg, #12121a 0%, #0d0d14 100%)',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '8px',
          width: '340px',
          maxWidth: 'calc(100vw - 32px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 169, 110, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(201, 169, 110, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#f0f0f5', fontSize: '13px', fontWeight: 600 }}>
              {inviter_name || '알 수 없음'}님이 회의에 초대했습니다
            </div>
            {meeting_name && (
              <div style={{ color: '#8a8a9a', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {meeting_name}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleJoin}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.4)',
              background: 'rgba(201, 169, 110, 0.2)',
              color: '#c9a96e',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 169, 110, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 169, 110, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.4)';
            }}
          >
            참가
          </button>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#8a8a9a',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#f0f0f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#8a8a9a';
            }}
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  // Default fallback for unknown notification types
  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
        background: 'linear-gradient(135deg, #12121a 0%, #0d0d14 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '8px',
        width: '340px',
        maxWidth: 'calc(100vw - 32px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span style={{ color: '#f0f0f5', fontSize: '13px' }}>
        {String((notification.data as Record<string, unknown>).message || '새 알림')}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#5a5a6a',
          cursor: 'pointer',
          padding: '4px',
          fontSize: '16px',
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}

export default function NotificationToast({ notifications, removeNotification }: Props) {
  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {notifications.map((n) => (
        <div key={n.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem notification={n} onRemove={() => removeNotification(n.id)} />
        </div>
      ))}
    </div>
  );
}
