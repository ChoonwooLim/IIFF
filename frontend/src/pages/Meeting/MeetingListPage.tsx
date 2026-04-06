import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";
import MeetingCard from "@/components/meeting/MeetingCard";
import InviteModal from "@/components/meeting/InviteModal";

interface MeetingCreator {
  id: number;
  nickname: string;
  profile_image: string | null;
}

interface Meeting {
  id: number;
  name: string;
  type: "video" | "text";
  status: string;
  max_participants: number;
  has_password: boolean;
  participant_count: number;
  creator: MeetingCreator;
  created_at: string;
}

/* ── Main Page ── */
export default function MeetingListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"video" | "text">("text");
  const [focused, setFocused] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<{ id: number; name: string } | null>(null);

  const fetchMeetings = () => {
    api.get("/meetings").then(({ data }) => setMeetings(data));
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/meetings", { name, type });
    setName("");
    setShowCreate(false);
    fetchMeetings();
  };

  const handleRename = async (meetingId: number, newName: string) => {
    try {
      await api.patch(`/meetings/${meetingId}`, { name: newName });
      fetchMeetings();
    } catch { /* ignore */ }
  };

  const handleDelete = async (meetingId: number) => {
    try {
      await api.delete(`/meetings/${meetingId}`);
      fetchMeetings();
    } catch { /* ignore */ }
  };

  const handleSetPassword = async (meetingId: number) => {
    const pw = prompt("회의실 비밀번호를 입력하세요:");
    if (!pw || !pw.trim()) return;
    try {
      await api.put(`/meetings/${meetingId}/password`, { password: pw.trim() });
      fetchMeetings();
    } catch { /* ignore */ }
  };

  const handleRemovePassword = async (meetingId: number) => {
    if (!confirm("비밀번호를 제거하시겠습니까?")) return;
    try {
      await api.delete(`/meetings/${meetingId}/password`);
      fetchMeetings();
    } catch { /* ignore */ }
  };

  const canManage = (creatorId: number) =>
    user?.id === creatorId || user?.role === "admin" || user?.role === "superadmin";

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Page header */}
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
            Meetings
          </p>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
            fontWeight: 700,
            color: '#f0f0f5',
          }}>
            회의실
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {user && (
            <button
              onClick={() => navigate("/meetings/minutes")}
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
                transition: 'all 0.3s ease',
              }}
            >
              회의록
            </button>
          )}
          {user && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              style={{
                padding: '10px 20px',
                background: showCreate ? 'transparent' : '#c9a96e',
                color: showCreate ? '#c9a96e' : '#05050a',
                border: showCreate ? '1px solid rgba(201,169,110,0.4)' : '1px solid #c9a96e',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {showCreate ? '취소' : '새 회의실'}
            </button>
          )}
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          style={{
            padding: '32px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: focused ? '#c9a96e' : '#5a5a6a',
              marginBottom: 4,
              transition: 'color 0.3s ease',
            }}>회의실 이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="회의실 이름을 입력하세요"
              required
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${focused ? '#c9a96e' : 'rgba(255,255,255,0.12)'}`,
                color: '#f0f0f5',
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: 24,
            marginBottom: 28,
          }}>
            {[
              { value: 'text' as const, label: '텍스트 채팅', icon: '💬' },
              { value: 'video' as const, label: '화상 회의', icon: '🎥' },
            ].map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '10px 16px',
                  border: `1px solid ${type === opt.value ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: type === opt.value ? 'rgba(201,169,110,0.06)' : 'transparent',
                  color: type === opt.value ? '#f0f0f5' : '#6a6a7a',
                  fontSize: 13,
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === opt.value}
                  onChange={() => setType(opt.value)}
                  style={{ display: 'none' }}
                />
                <span>{opt.icon}</span>
                {opt.label}
              </label>
            ))}
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 32px',
              background: '#c9a96e',
              color: '#05050a',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            생성
          </button>
        </form>
      )}

      {/* Meeting list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
        paddingTop: 32,
        paddingBottom: 32,
      }}>
        {meetings.map((m, i) => (
          <div key={m.id} style={{
            animation: `cardStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both`,
          }}>
            <MeetingCard id={m.id} name={m.name} type={m.type}
              participantCount={m.participant_count} maxParticipants={m.max_participants}
              hasPassword={m.has_password}
              creator={m.creator} createdAt={m.created_at}
              canManage={canManage(m.creator.id)}
              onRename={handleRename} onDelete={handleDelete}
              onInvite={(id, name) => setInviteTarget({ id, name })}
              onSetPassword={handleSetPassword}
              onRemovePassword={handleRemovePassword} />
          </div>
        ))}
      </div>
      {meetings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: '#3a3a4a',
        }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>활성화된 회의실이 없습니다</p>
          {user && (
            <p style={{ fontSize: 13, color: '#5a5a6a' }}>
              위의 <span style={{ color: '#c9a96e' }}>새 회의실</span> 버튼으로 시작하세요
            </p>
          )}
        </div>
      )}

      {/* Usage guide */}
      <div style={{
        padding: '48px 0 64px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#c9a96e',
          marginBottom: 20,
        }}>
          How to use
        </p>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 20,
          fontWeight: 600,
          color: '#f0f0f5',
          marginBottom: 32,
        }}>
          회의실 사용 가이드
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              step: '01',
              title: '회의실 생성',
              desc: '"새 회의실" 버튼을 클릭하여 텍스트 채팅 또는 화상 회의 타입을 선택하고 회의실을 만드세요.',
            },
            {
              step: '02',
              title: '멤버 초대',
              desc: '회의실 카드의 ⋮ 메뉴에서 "멤버 초대"를 선택하고, 이름 또는 닉네임으로 검색하여 초대하세요.',
            },
            {
              step: '03',
              title: '입장 및 참여',
              desc: '초대받은 멤버만 회의실에 입장할 수 있습니다. 회의실 카드를 클릭하여 입장하세요.',
            },
            {
              step: '04',
              title: '회의실 관리',
              desc: '개설자는 회의실 이름 수정, 삭제, 종료가 가능합니다. 관리자는 모든 회의실을 관리할 수 있습니다.',
            },
          ].map((item, i) => (
            <div key={item.step} style={{
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              animation: `cardStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
            }}>
              <span style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#c9a96e',
                marginBottom: 12,
              }}>
                STEP {item.step}
              </span>
              <h3 style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#f0f0f5',
                marginBottom: 8,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 13,
                color: '#6a6a7a',
                lineHeight: 1.7,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite modal */}
      {inviteTarget && (
        <InviteModal
          meetingId={inviteTarget.id}
          meetingName={inviteTarget.name}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </div>
  );
}
