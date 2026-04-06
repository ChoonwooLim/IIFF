import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

interface MinutesDetail {
  id: number;
  meeting_id: number;
  title: string;
  content: string;
  creator: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 2vw, 2rem)',
          fontWeight: 700,
          color: '#f0f0f5',
          marginBottom: 24,
          lineHeight: 1.3,
        }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} style={{
          fontSize: 17,
          fontWeight: 600,
          color: '#c9a96e',
          marginTop: 32,
          marginBottom: 16,
          letterSpacing: '0.02em',
        }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#8a8a9a',
          marginTop: 24,
          marginBottom: 12,
          letterSpacing: '0.04em',
        }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line === "---") {
      elements.push(
        <hr key={i} style={{
          border: 'none',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          margin: '24px 0',
        }} />
      );
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      // Inline formatting: bold and italic
      const formatted = formatInline(line);
      elements.push(
        <p key={i} style={{
          fontSize: 14,
          color: '#c0c0ca',
          lineHeight: 1.8,
          marginBottom: 4,
        }}>
          {formatted}
        </p>
      );
    }
    i++;
  }

  return elements;
}

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // First try chat message pattern: **[HH:MM] Name:** content
  const chatRegex = /\*\*\[(\d{2}:\d{2})\]\s*(.+?):\*\*\s*(.*)/;
  const chatMatch = text.match(chatRegex);
  if (chatMatch) {
    return [
      <span key="time" style={{ color: '#5a5a6a', fontSize: 12, marginRight: 8 }}>
        {chatMatch[1]}
      </span>,
      <span key="name" style={{ color: '#c9a96e', fontWeight: 600, marginRight: 8 }}>
        {chatMatch[2]}
      </span>,
      <span key="content">{chatMatch[3]}</span>,
    ];
  }

  // General bold/italic
  const boldRegex = /\*\*(.+?)\*\*/g;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} style={{ color: '#e0e0e8', fontWeight: 600 }}>
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0 && parts.length === 0) {
    // Check for italic
    const italicRegex = /\*(.+?)\*/g;
    while ((match = italicRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <em key={match.index} style={{ color: '#8a8a9a', fontStyle: 'italic' }}>
          {match[1]}
        </em>
      );
      lastIndex = match.index + match[0].length;
    }
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function MeetingMinutesDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState<MinutesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/meetings/${meetingId}/minutes`)
      .then(({ data }) => setMinutes(data))
      .catch(() => setError("회의록을 찾을 수 없습니다"))
      .finally(() => setLoading(false));
  }, [meetingId]);

  if (loading) {
    return (
      <div style={{
        maxWidth: 720, margin: '0 auto', padding: '180px 24px',
        textAlign: 'center', color: '#5a5a6a',
      }}>
        <div style={{
          width: 24, height: 24,
          border: '2px solid rgba(201,169,110,0.3)',
          borderTop: '2px solid #c9a96e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }} />
        불러오는 중...
      </div>
    );
  }

  if (error || !minutes) {
    return (
      <div style={{
        maxWidth: 720, margin: '0 auto', padding: '180px 24px',
        textAlign: 'center', color: '#dc5050',
      }}>
        <p style={{ marginBottom: 16 }}>{error || "회의록을 찾을 수 없습니다"}</p>
        <button
          onClick={() => navigate("/meetings/minutes")}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid rgba(201,169,110,0.4)',
            color: '#c9a96e',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Nav */}
      <div style={{
        paddingTop: 120,
        paddingBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <button
          onClick={() => navigate("/meetings/minutes")}
          style={{
            background: 'none', border: 'none',
            color: '#6a6a7a', cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c9a96e'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6a6a7a'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
          회의록 목록
        </button>
      </div>

      {/* Meta */}
      <div style={{
        padding: '16px 0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 32,
      }}>
        <div style={{
          display: 'flex',
          gap: 16,
          fontSize: 12,
          color: '#5a5a6a',
        }}>
          <span>작성자: {minutes.creator.nickname}</span>
          <span>{new Date(minutes.created_at).toLocaleDateString("ko-KR", {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        paddingBottom: 96,
        animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {renderMarkdown(minutes.content)}
      </div>
    </div>
  );
}
