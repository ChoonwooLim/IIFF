import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MeetingCardProps {
  id: number;
  name: string;
  type: "video" | "text";
  participantCount: number;
  maxParticipants: number;
  creator: { id: number; nickname: string };
  createdAt: string;
  canManage?: boolean;
  onRename?: (id: number, newName: string) => void;
  onDelete?: (id: number) => void;
  onInvite?: (id: number, name: string) => void;
}

export default function MeetingCard({ id, name, type, participantCount, maxParticipants, creator, createdAt, canManage, onRename, onDelete, onInvite }: MeetingCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const icon = type === "video" ? "🎥" : "💬";
  const path = type === "video" ? `/meetings/video/${id}` : `/meetings/chat/${id}`;

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleRename = () => {
    if (savingRef.current) return;
    savingRef.current = true;
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name && onRename) {
      onRename(id, trimmed);
    }
    setEditing(false);
    setTimeout(() => { savingRef.current = false; }, 100);
  };

  const handleCardClick = () => {
    if (editing || showMenu) return;
    navigate(path);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '24px',
        border: `1px solid ${hovered || editing ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.06)'}`,
        background: hovered || editing ? 'rgba(201,169,110,0.03)' : 'transparent',
        textDecoration: 'none',
        cursor: editing ? 'default' : 'pointer',
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
        {editing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleRename(); }
              if (e.key === "Escape") { e.preventDefault(); setEditName(name); setEditing(false); }
            }}
            onBlur={handleRename}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              fontSize: '1rem',
              fontWeight: 500,
              color: '#f0f0f5',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #c9a96e',
              outline: 'none',
              padding: '2px 0',
            }}
          />
        ) : (
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
        )}
        {canManage && !editing && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                color: '#5a5a6a',
                fontSize: 18,
                lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c9a96e'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5a5a6a'}
            >
              ⋮
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 4,
                background: '#15151f',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 20,
                minWidth: 120,
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    if (onInvite) onInvite(id, name);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#c0c0ca',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  멤버 초대
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    setEditName(name);
                    setEditing(true);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#c0c0ca',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  이름 수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    if (onDelete && confirm("회의실을 삭제하시겠습니까?")) onDelete(id);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#dc5050',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,80,80,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
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
    </div>
  );
}
