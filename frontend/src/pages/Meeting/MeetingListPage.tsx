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
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<{ id: number; name: string } | null>(null);

  const fetchMeetings = () => {
    api.get("/meetings").then(({ data }) => setMeetings(data));
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/meetings", { name, type, password: password.trim() || undefined });
    setName("");
    setPassword("");
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
    user?.id === creatorId || user?.role === "vvip" || user?.role === "admin" || user?.role === "superadmin";

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
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#5a5a6a',
              marginBottom: 4,
            }}>비밀번호 (선택)</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 없이 생성하려면 비워두세요"
              type="password"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
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
          marginBottom: 40,
        }}>
          회의실 사용 가이드
        </h2>

        {/* 공통 사용법 */}
        <h3 style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#c9a96e',
          letterSpacing: '0.08em',
          marginBottom: 20,
        }}>
          기본 사용법
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 48,
        }}>
          {[
            {
              step: '01',
              title: '회의실 생성',
              desc: '"새 회의실" 버튼을 클릭 → 문자 채팅 또는 화상 회의 타입 선택 → 회의실 이름 입력 후 생성합니다.',
            },
            {
              step: '02',
              title: '멤버 초대',
              desc: '회의실 카드의 ⋮ 메뉴에서 "멤버 초대" 선택 → 이름/닉네임 검색 → 초대합니다. 비밀번호를 설정하면 비밀번호로도 입장 가능합니다.',
            },
            {
              step: '03',
              title: '입장',
              desc: '회의실 카드를 클릭하면 입장됩니다. 비밀번호가 설정된 경우 비밀번호 입력 후 입장합니다. 개설자/관리자/초대받은 멤버는 바로 입장 가능합니다.',
            },
            {
              step: '04',
              title: '관리',
              desc: '개설자는 ⋮ 메뉴에서 이름 수정, 삭제, 비밀번호 설정/제거가 가능합니다. 관리자는 모든 회의실을 관리할 수 있습니다.',
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

        {/* 문자 채팅 & 화상 회의 비교 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {/* 문자 채팅 */}
          <div style={{
            border: '1px solid rgba(201,169,110,0.15)',
            animation: 'cardStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(201,169,110,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f5' }}>문자 채팅</h3>
                <p style={{ fontSize: 11, color: '#6a6a7a', marginTop: 2 }}>Text Chat</p>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                { label: '실시간 메시지', desc: '텍스트 메시지를 실시간으로 주고받습니다. Shift+Enter로 줄바꿈, Enter로 전송합니다.' },
                { label: '파일 공유', desc: '이미지, 동영상, 문서(PDF, HWP, PPT 등)를 첨부하여 전송할 수 있습니다. 이미지와 동영상은 채팅 내에서 바로 미리보기/재생됩니다.' },
                { label: '멤버 초대', desc: '채팅방 상단의 "초대" 버튼 또는 회의실 카드의 ⋮ 메뉴에서 멤버를 초대할 수 있습니다. 이름/닉네임으로 검색하여 초대하면 해당 멤버가 바로 입장할 수 있습니다.' },
                { label: '비밀번호 설정', desc: '회의실 생성 시 비밀번호를 설정하거나, 생성 후 카드 메뉴에서 비밀번호를 추가/변경/제거할 수 있습니다. 초대된 멤버와 관리자는 비밀번호 없이 입장 가능합니다.' },
                { label: '대화 기록', desc: '모든 대화 내용은 자동으로 서버에 저장됩니다. 재입장 시 이전 대화 내용을 확인할 수 있습니다.' },
                { label: '회의록 생성', desc: '회의 종료 시 대화 내용을 바탕으로 회의록을 자동 생성합니다. 회의록 목록 페이지에서 조회/삭제할 수 있습니다.' },
                { label: '참여자 확인', desc: '오른쪽 상단의 참여자 아이콘을 클릭하면 현재 접속 중인 멤버 목록을 확인할 수 있습니다.' },
              ].map((feat, i) => (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e8', marginBottom: 4 }}>{feat.label}</p>
                  <p style={{ fontSize: 12, color: '#5a5a6a', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 화상 회의 */}
          <div style={{
            border: '1px solid rgba(100,149,237,0.15)',
            animation: 'cardStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(100,149,237,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6495ed" strokeWidth="1.5">
                  <polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f5' }}>화상 회의</h3>
                <p style={{ fontSize: 11, color: '#6a6a7a', marginTop: 2 }}>Video Conference</p>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                { label: '영상 통화', desc: 'WebRTC 기반 화상 회의입니다. 웹캠과 마이크를 사용하여 실시간으로 대화합니다. 별도 프로그램 설치가 필요 없습니다.' },
                { label: '입장 전 설정', desc: '입장 전 카메라/마이크 미리보기, 디바이스 선택, 오디오 레벨 테스트를 할 수 있습니다.' },
                { label: '멤버 초대', desc: '회의 중 상단의 "초대" 버튼으로 멤버를 검색하여 초대할 수 있습니다. 초대된 멤버는 비밀번호 없이 바로 입장 가능합니다.' },
                { label: '비밀번호 설정', desc: '생성 시 비밀번호를 설정하거나, 카드 메뉴에서 추가/변경/제거할 수 있습니다. 초대된 멤버와 관리자는 비밀번호 없이 입장 가능합니다.' },
                { label: '화면 공유', desc: '발표 자료나 작업 화면을 참여자들에게 실시간으로 공유할 수 있습니다. 하단 도구모음의 화면 공유 버튼을 클릭하세요.' },
                { label: '내장 채팅', desc: '화상 회의 중에도 사이드 패널 텍스트 채팅을 사용할 수 있습니다. 하단 도구모음에서 채팅 아이콘을 클릭하세요.' },
                { label: '카메라/마이크 제어', desc: '하단 도구모음에서 카메라 ON/OFF, 마이크 음소거/해제를 자유롭게 전환할 수 있습니다. 통화 중 디바이스 변경도 가능합니다.' },
                { label: '손들기', desc: '하단 도구모음의 손들기 버튼으로 발언 의사를 표시할 수 있습니다. 모든 참가자 화면에 실시간으로 반영됩니다.' },
              ].map((feat, i) => (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e8', marginBottom: 4 }}>{feat.label}</p>
                  <p style={{ fontSize: 12, color: '#5a5a6a', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
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
