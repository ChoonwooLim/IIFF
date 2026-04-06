interface Props {
  user: { id: number; nickname: string; profile_image?: string | null };
  content: string;
  timestamp: string;
  isOwn: boolean;
  showAvatar: boolean;
  showName: boolean;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
}

function formatTime(ts: string) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "오전" : "오후";
  return `${ampm} ${h % 12 || 12}:${m}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function FileContent({ fileUrl, fileName, fileType, fileSize }: {
  fileUrl: string; fileName: string; fileType: string; fileSize?: number | null;
}) {
  const isImage = fileType.startsWith("image/");
  const isVideo = fileType.startsWith("video/");

  if (isImage) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
        <img
          src={fileUrl}
          alt={fileName}
          style={{
            maxWidth: '100%',
            maxHeight: 280,
            borderRadius: 6,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </a>
    );
  }

  if (isVideo) {
    return (
      <video
        src={fileUrl}
        controls
        preload="metadata"
        style={{
          maxWidth: '100%',
          maxHeight: 280,
          borderRadius: 6,
          display: 'block',
        }}
      />
    );
  }

  // Document / other file
  return (
    <a
      href={fileUrl}
      download={fileName}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 6,
        textDecoration: 'none',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, color: '#e0e0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</p>
        {fileSize != null && <p style={{ fontSize: 11, color: '#5a5a6a', marginTop: 2 }}>{formatFileSize(fileSize)}</p>}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a6a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}

function BubbleContent({ content, fileUrl, fileName, fileType, fileSize }: {
  content: string; fileUrl?: string | null; fileName?: string | null; fileType?: string | null; fileSize?: number | null;
}) {
  if (fileUrl && fileName && fileType) {
    return <FileContent fileUrl={fileUrl} fileName={fileName} fileType={fileType} fileSize={fileSize} />;
  }
  return (
    <p style={{
      fontSize: 14,
      color: '#e0e0e8',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>{content}</p>
  );
}

export default function ChatMessage({ user, content, timestamp, isOwn, showAvatar, showName, fileUrl, fileName, fileType, fileSize }: Props) {
  const time = formatTime(timestamp);
  const hasFile = !!(fileUrl && fileName && fileType);

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
        animation: 'msgSlideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
          padding: hasFile ? '6px' : '10px 14px',
          maxWidth: '70%',
          overflow: 'hidden',
        }}>
          <BubbleContent content={content} fileUrl={fileUrl} fileName={fileName} fileType={fileType} fileSize={fileSize} />
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
      animation: 'msgSlideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
            padding: hasFile ? '6px' : '10px 14px',
            maxWidth: '70%',
            overflow: 'hidden',
          }}>
            <BubbleContent content={content} fileUrl={fileUrl} fileName={fileName} fileType={fileType} fileSize={fileSize} />
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
      animation: 'msgFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
