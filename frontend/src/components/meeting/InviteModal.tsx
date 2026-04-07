import { useState, useEffect, useRef } from "react";
import api from "@/services/api";

interface SearchUser {
  id: number;
  nickname: string;
  name: string;
  profile_image: string | null;
}

interface Invitation {
  id: number;
  user: { id: number; nickname: string; profile_image: string | null };
  invited_at: string;
}

export default function InviteModal({ meetingId, meetingName, onClose }: { meetingId: number; meetingName: string; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchInvitations = () => {
    api.get(`/meetings/${meetingId}/invitations`).then(({ data }) => setInvitations(data));
  };

  useEffect(() => { fetchInvitations(); }, [meetingId]);

  const handleSearch = (q: string) => {
    setQuery(q);
    clearTimeout(timerRef.current);
    if (q.trim().length < 1) { setResults([]); return; }
    setSearching(true);
    timerRef.current = setTimeout(() => {
      api.get("/meetings/users/search", { params: { q } })
        .then(({ data }) => setResults(data))
        .finally(() => setSearching(false));
    }, 300);
  };

  const [statusMsg, setStatusMsg] = useState('');

  const handleInvite = async (userId: number) => {
    const { data } = await api.post(`/meetings/${meetingId}/invite`, { user_id: userId });
    setResults((prev) => prev.filter((u) => u.id !== userId));
    fetchInvitations();
    setStatusMsg(data.message || '');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleRemove = async (userId: number) => {
    await api.delete(`/meetings/${meetingId}/invite/${userId}`);
    fetchInvitations();
  };

  const invitedIds = new Set(invitations.map((inv) => inv.user.id));

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'backdropFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,255,255,0.08)',
          width: '100%',
          maxWidth: 480,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f5' }}>
              멤버 초대
            </h3>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: '#5a5a6a', fontSize: 20, cursor: 'pointer',
            }}>&times;</button>
          </div>
          <p style={{ fontSize: 12, color: '#5a5a6a', marginBottom: 16 }}>
            {meetingName}
          </p>
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="이름 또는 닉네임으로 검색"
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f0f0f5',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        {/* Search results */}
        {results.length > 0 && (
          <div style={{
            padding: '8px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            maxHeight: 200,
            overflowY: 'auto',
          }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5a6a', marginBottom: 8 }}>
              검색 결과
            </p>
            {results.map((u) => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div>
                  <span style={{ color: '#f0f0f5', fontSize: 14 }}>{u.nickname}</span>
                  <span style={{ color: '#5a5a6a', fontSize: 12, marginLeft: 8 }}>{u.name}</span>
                </div>
                {invitedIds.has(u.id) ? (
                  <span style={{ fontSize: 11, color: '#5a5a6a' }}>초대됨</span>
                ) : (
                  <button
                    onClick={() => handleInvite(u.id)}
                    style={{
                      padding: '4px 12px',
                      background: 'rgba(201,169,110,0.15)',
                      border: '1px solid rgba(201,169,110,0.3)',
                      color: '#c9a96e',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    초대
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {searching && (
          <div style={{ padding: '16px 24px', color: '#5a5a6a', fontSize: 13 }}>검색 중...</div>
        )}

        {/* Invited list */}
        <div style={{
          padding: '16px 24px',
          flex: 1,
          overflowY: 'auto',
        }}>
          <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5a6a', marginBottom: 12 }}>
            초대된 멤버 ({invitations.length})
          </p>
          {invitations.length === 0 && (
            <p style={{ color: '#3a3a4a', fontSize: 13 }}>아직 초대된 멤버가 없습니다</p>
          )}
          {invitations.map((inv) => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <span style={{ color: '#c0c0ca', fontSize: 14 }}>{inv.user.nickname}</span>
              <button
                onClick={() => handleRemove(inv.user.id)}
                style={{
                  background: 'none', border: 'none', color: '#dc5050',
                  fontSize: 12, cursor: 'pointer',
                }}
              >
                취소
              </button>
            </div>
          ))}
        </div>

        {/* Status message */}
        {statusMsg && (
          <div style={{
            padding: '8px 24px', fontSize: 12, textAlign: 'center',
            color: statusMsg.includes('오프라인') ? '#facc15' : '#4ade80',
            background: statusMsg.includes('오프라인') ? 'rgba(250,204,21,0.06)' : 'rgba(74,222,128,0.06)',
          }}>
            {statusMsg}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: '10px 32px', borderRadius: 8,
            background: 'rgba(201,169,110,0.2)', border: '1px solid rgba(201,169,110,0.4)',
            color: '#c9a96e', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>확인</button>
        </div>
      </div>
    </div>
  );
}
