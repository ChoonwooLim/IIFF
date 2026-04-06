import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

interface Board {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  board_type: string;
}

const BOARD_META: Record<string, { icon: string; accent: string }> = {
  notice:     { icon: "📢", accent: "#c9a96e" },
  suggestion: { icon: "💡", accent: "#e0c992" },
  image:      { icon: "🖼️", accent: "#a8b4c4" },
  video:      { icon: "🎬", accent: "#c49a6c" },
  archive:    { icon: "📁", accent: "#8a9a7a" },
  qna:        { icon: "❓", accent: "#b48a8a" },
};

function BoardCard({ board, index }: { board: Board; index: number }) {
  const [hovered, setHovered] = useState(false);
  const meta = BOARD_META[board.slug] || { icon: "📋", accent: "#c9a96e" };

  return (
    <Link
      to={`/boards/${board.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        position: 'relative',
        padding: '32px 28px',
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.35s ease',
        animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
      }}
    >
      {/* Gold left accent on hover */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 2,
        height: hovered ? '40%' : 0,
        background: meta.accent,
        transition: 'height 0.3s ease',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <span style={{
          fontSize: 28,
          lineHeight: 1,
          filter: hovered ? 'none' : 'grayscale(0.3)',
          transition: 'filter 0.3s ease',
        }}>
          {meta.icon}
        </span>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            color: hovered ? '#f0f0f5' : '#c0c0ca',
            transition: 'color 0.3s ease',
            letterSpacing: '0.01em',
            lineHeight: 1.4,
          }}>
            {board.name}
          </h2>
          {board.description && (
            <p style={{
              fontSize: '0.8125rem',
              color: '#5a5a6a',
              marginTop: 4,
              lineHeight: 1.5,
            }}>
              {board.description}
            </p>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke={hovered ? '#c9a96e' : '#3a3a4a'}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease', transform: hovered ? 'translateX(3px)' : 'none' }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.get("/boards").then(({ data }) => setBoards(data));
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Page header */}
      <div style={{
        paddingTop: 120,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c9a96e',
          marginBottom: 12,
        }}>
          Community
        </p>
        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
          fontWeight: 700,
          color: '#f0f0f5',
        }}>
          게시판
        </h1>
      </div>

      {/* Board list */}
      <div>
        {boards.map((board, i) => (
          <BoardCard key={board.id} board={board} index={i} />
        ))}
      </div>
    </div>
  );
}
