import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

interface MinutesItem {
  id: number;
  meeting_id: number;
  title: string;
  creator: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

export default function MeetingMinutesListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState<MinutesItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMinutes = () => {
    api.get("/meetings/minutes/list")
      .then(({ data }) => setMinutes(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMinutes(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("회의록을 삭제하시겠습니까?")) return;
    await api.delete(`/meetings/minutes/${id}`);
    fetchMinutes();
  };

  const canDelete = (creatorId: number) =>
    user?.id === creatorId || user?.role === "admin" || user?.role === "superadmin";

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{
        paddingTop: 120,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            marginBottom: 12,
          }}>
            Minutes
          </p>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
            fontWeight: 700,
            color: '#f0f0f5',
          }}>
            회의록
          </h1>
        </div>
        <button
          onClick={() => navigate("/meetings")}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#c9a96e',
            border: '1px solid rgba(201,169,110,0.4)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          회의실 목록
        </button>
      </div>

      {/* Minutes list */}
      <div style={{ paddingTop: 32, paddingBottom: 64 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5a5a6a' }}>
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
        )}

        {!loading && minutes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#3a3a4a',
          }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>저장된 회의록이 없습니다</p>
            <p style={{ fontSize: 13, color: '#5a5a6a' }}>
              종료된 회의에서 회의록을 생성할 수 있습니다
            </p>
          </div>
        )}

        {minutes.map((m, i) => (
          <div
            key={m.id}
            onClick={() => navigate(`/meetings/${m.meeting_id}/minutes`)}
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: `cardStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both`,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,110,0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#e0e0e8',
                  marginBottom: 8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {m.title}
                </h3>
                <div style={{
                  display: 'flex',
                  gap: 16,
                  fontSize: 12,
                  color: '#5a5a6a',
                }}>
                  <span>{m.creator.nickname}</span>
                  <span>{new Date(m.created_at).toLocaleDateString("ko-KR", {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}</span>
                </div>
              </div>
              {canDelete(m.creator.id) && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                  style={{
                    padding: '4px 10px',
                    background: 'none',
                    border: '1px solid rgba(220,80,80,0.2)',
                    color: '#dc5050',
                    fontSize: 11,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,80,80,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
