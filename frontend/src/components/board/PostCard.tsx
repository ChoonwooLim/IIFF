import { useState } from "react";
import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  boardSlug: string;
  title: string;
  user: { nickname: string };
  viewCount: number;
  commentCount: number;
  fileCount: number;
  isPinned: boolean;
  createdAt: string;
}

export default function PostCard({
  id, boardSlug, title, user, viewCount, commentCount, fileCount, isPinned, createdAt,
}: PostCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/boards/${boardSlug}/posts/${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        marginLeft: -12,
        marginRight: -12,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      {/* Gold left accent on hover */}
      <div style={{
        width: 2,
        height: hovered ? 24 : 0,
        background: '#c9a96e',
        transition: 'height 0.3s ease',
        flexShrink: 0,
      }} />

      {/* Pinned badge */}
      {isPinned && (
        <span style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          border: '1px solid rgba(201,169,110,0.3)',
          color: '#c9a96e',
          flexShrink: 0,
        }}>
          고정
        </span>
      )}

      {/* Title */}
      <h3 style={{
        flex: 1,
        fontSize: 15,
        fontWeight: 500,
        color: hovered ? '#f0f0f5' : '#c0c0ca',
        transition: 'color 0.3s ease',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0,
      }}>
        {title}
      </h3>

      {/* Meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 12,
        color: '#5a5a6a',
        flexShrink: 0,
      }}>
        <span>{user.nickname}</span>
        <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
        <span style={{ color: '#4a4a5a' }}>
          {viewCount}
          {commentCount > 0 && <span style={{ marginLeft: 10, color: '#c9a96e' }}>+{commentCount}</span>}
        </span>
        {fileCount > 0 && (
          <span style={{ color: '#4a4a5a' }}>📎</span>
        )}
      </div>

      {/* Arrow */}
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke={hovered ? '#c9a96e' : '#2a2a3a'}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'all 0.3s ease', transform: hovered ? 'translateX(2px)' : 'none', flexShrink: 0 }}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
