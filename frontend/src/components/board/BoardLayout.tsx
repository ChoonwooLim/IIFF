import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

interface Board {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  board_type: string;
}

const BOARD_ICONS: Record<string, string> = {
  notice: "📢",
  suggestion: "💡",
  image: "🖼️",
  video: "🎬",
  archive: "📁",
  qna: "❓",
};

/* ── Desktop sidebar link ── */
function SidebarLink({ board, isActive }: { board: Board; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const icon = BOARD_ICONS[board.slug] || "📋";

  return (
    <Link
      to={`/boards/${board.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        textDecoration: 'none',
        borderRadius: 8,
        position: 'relative',
        background: isActive
          ? 'rgba(201,169,110,0.1)'
          : hovered
            ? 'rgba(255,255,255,0.03)'
            : 'transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{
        position: 'absolute',
        left: 0,
        top: '20%',
        bottom: '20%',
        width: 2,
        borderRadius: 1,
        background: '#c9a96e',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }} />
      <span style={{
        fontSize: '1rem',
        lineHeight: 1,
        filter: isActive || hovered ? 'none' : 'grayscale(0.5)',
        transition: 'filter 0.25s ease',
      }}>
        {icon}
      </span>
      <span style={{
        fontSize: '0.8125rem',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#c9a96e' : hovered ? '#f0f0f5' : '#8a8a9a',
        transition: 'color 0.25s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {board.name}
      </span>
    </Link>
  );
}

/* ── Mobile horizontal nav ── */
function MobileBoardNav({ boards, currentSlug }: { boards: Board[]; currentSlug: string }) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      paddingBottom: 12,
      marginBottom: 20,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      scrollbarWidth: 'none',
    }}>
      {boards.map((board) => {
        const isActive = board.slug === currentSlug;
        const icon = BOARD_ICONS[board.slug] || "📋";
        return (
          <Link
            key={board.id}
            to={`/boards/${board.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontSize: '0.75rem',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#c9a96e' : '#8a8a9a',
              border: isActive ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.25s ease',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>{icon}</span>
            {board.name}
          </Link>
        );
      })}
    </div>
  );
}

/* ── Shared board layout with sidebar ── */
export default function BoardLayout({
  currentSlug,
  children,
}: {
  currentSlug: string;
  children: ReactNode;
}) {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.get("/boards").then(({ data }) => setBoards(data));
  }, []);

  return (
    <div style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 24px',
      paddingTop: 100,
    }}>
      {/* Mobile board nav */}
      <div className="block md:hidden" style={{ paddingTop: 20 }}>
        <MobileBoardNav boards={boards} currentSlug={currentSlug} />
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'flex',
        gap: 40,
        alignItems: 'flex-start',
      }}>
        {/* Left sidebar */}
        <aside
          className="hidden md:block"
          style={{
            width: 200,
            flexShrink: 0,
            position: 'sticky',
            top: 100,
            paddingTop: 20,
          }}
        >
          <p style={{
            fontSize: '0.625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#5a5a6a',
            marginBottom: 12,
            paddingLeft: 14,
          }}>
            게시판
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {boards.map((board) => (
              <SidebarLink
                key={board.id}
                board={board}
                isActive={board.slug === currentSlug}
              />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
