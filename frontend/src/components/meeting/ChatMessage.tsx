interface Props {
  user: { id: number; nickname: string; profile_image?: string | null };
  content: string;
  timestamp: string;
  isOwn: boolean;
  showAvatar: boolean; // false when consecutive messages from same user
  showName: boolean;
}

function formatTime(ts: string) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "오전" : "오후";
  return `${ampm} ${h % 12 || 12}:${m}`;
}

export default function ChatMessage({ user, content, timestamp, isOwn, showAvatar, showName }: Props) {
  const time = formatTime(timestamp);

  if (isOwn) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 6,
        marginTop: showName ? 12 : 2,
        paddingRight: 16,
        paddingLeft: 60,
      }}>
        <span style={{
          fontSize: 10,
          color: '#4a4a5a',
          whiteSpace: 'nowrap',
          marginBottom: 2,
        }}>{time}</span>
        <div style={{
          background: 'rgba(201,169,110,0.2)',
          border: '1px solid rgba(201,169,110,0.15)',
          borderRadius: '12px 4px 12px 12px',
          padding: '10px 14px',
          maxWidth: '70%',
        }}>
          <p style={{
            fontSize: 14,
            color: '#f0f0f5',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      marginTop: showName ? 12 : 2,
      paddingLeft: 16,
      paddingRight: 60,
    }}>
      {/* Avatar */}
      <div style={{ width: 36, flexShrink: 0 }}>
        {showAvatar && (
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(201,169,110,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {user.profile_image ? (
              <img src={user.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 14, color: '#c9a96e' }}>
                {user.nickname.charAt(0)}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {showName && (
          <p style={{
            fontSize: 12,
            color: '#8a8a9a',
            marginBottom: 4,
          }}>{user.nickname}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px 12px 12px 12px',
            padding: '10px 14px',
            maxWidth: '70%',
          }}>
            <p style={{
              fontSize: 14,
              color: '#e0e0e8',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>{content}</p>
          </div>
          <span style={{
            fontSize: 10,
            color: '#4a4a5a',
            whiteSpace: 'nowrap',
            marginBottom: 2,
          }}>{time}</span>
        </div>
      </div>
    </div>
  );
}


/* System message (join/leave) */
export function SystemMessage({ text }: { text: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '8px 0',
    }}>
      <span style={{
        display: 'inline-block',
        padding: '4px 14px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        fontSize: 11,
        color: '#5a5a6a',
      }}>{text}</span>
    </div>
  );
}


/* Date separator */
export function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  const formatted = d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <span style={{ fontSize: 11, color: '#5a5a6a', whiteSpace: 'nowrap' }}>{formatted}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}
