import { useState } from "react";
import { Link } from "react-router-dom";

interface MeetingCardProps {
  id: number;
  name: string;
  type: "video" | "text";
  participantCount: number;
  maxParticipants: number;
  creator: { nickname: string };
  createdAt: string;
}

export default function MeetingCard({ id, name, type, participantCount, maxParticipants, creator, createdAt }: MeetingCardProps) {
  const [hovered, setHovered] = useState(false);
  const icon = type === "video" ? "🎥" : "💬";
  const path = type === "video" ? `/meetings/video/${id}` : `/meetings/chat/${id}`;

  return (
    <Link
      to={path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '24px',
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(201,169,110,0.03)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h3 style={{
          flex: 1,
          fontSize: '1rem',
          fontWeight: 500,
          lineHeight: 1.4,
          color: hovered ? '#f0f0f5' : '#c0c0ca',
          transition: 'color 0.3s ease',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{name}</h3>
        <span style={{
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#6a6a7a',
        }}>
          {type === "video" ? "화상" : "텍스트"}
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        fontSize: '0.8125rem',
        color: '#5a5a6a',
      }}>
        <span>{creator.nickname}</span>
        <span style={{ color: '#c9a96e' }}>{participantCount}/{maxParticipants}</span>
        <span style={{ marginLeft: 'auto' }}>
          {new Date(createdAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
    </Link>
  );
}
