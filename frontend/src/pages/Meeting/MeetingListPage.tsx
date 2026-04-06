import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import api from "@/services/api";
import MeetingCard from "@/components/meeting/MeetingCard";

interface Meeting {
  id: number;
  name: string;
  type: "video" | "text";
  status: string;
  max_participants: number;
  participant_count: number;
  creator: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

export default function MeetingListPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"video" | "text">("text");
  const [focused, setFocused] = useState(false);

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
            fontSize: 40,
            fontWeight: 700,
            color: '#f0f0f5',
          }}>
            회의실
          </h1>
        </div>
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

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          style={{
            padding: '32px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            animation: 'fadeUp 0.3s ease',
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
        paddingBottom: 64,
      }}>
        {meetings.map((m) => (
          <MeetingCard key={m.id} id={m.id} name={m.name} type={m.type}
            participantCount={m.participant_count} maxParticipants={m.max_participants}
            creator={m.creator} createdAt={m.created_at} />
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
    </div>
  );
}
