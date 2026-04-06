import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import ChatMessageComponent, { SystemMessage, DateSeparator } from "@/components/meeting/ChatMessage";
import ParticipantList from "@/components/meeting/ParticipantList";

interface ChatMsg {
  id?: string;
  type: "message" | "system";
  user: { id: number; nickname: string; profile_image?: string | null };
  content: string;
  timestamp: string;
}

export default function TextChatPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [participants, setParticipants] = useState<{ id: number; nickname: string; profile_image: string | null }[]>([]);
  const [input, setInput] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => {
      setMeetingName(data.name);
      setCreatorId(data.creator?.id ?? null);
    });
    api.get(`/meetings/${meetingId}/messages`).then(({ data }) => {
      setMessages(data.map((m: any) => ({
        type: "message" as const,
        user: m.user,
        content: m.content,
        timestamp: m.created_at,
      })));
    });

    const token = localStorage.getItem("access_token");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws/meetings/${meetingId}?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message" && data.user && data.content) {
        setMessages((prev) => [...prev, {
          type: "message",
          user: data.user,
          content: data.content,
          timestamp: data.timestamp || new Date().toISOString(),
        }]);
      } else if (data.type === "participants" && data.users) {
        setParticipants(data.users);
      } else if (data.type === "user_joined") {
        setMessages((prev) => [...prev, {
          type: "system",
          user: data.user,
          content: `${data.user.nickname}님이 입장했습니다`,
          timestamp: new Date().toISOString(),
        }]);
        refreshParticipants();
      } else if (data.type === "user_left") {
        setMessages((prev) => [...prev, {
          type: "system",
          user: data.user,
          content: `${data.user.nickname}님이 나갔습니다`,
          timestamp: new Date().toISOString(),
        }]);
        refreshParticipants();
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      api.post(`/meetings/${meetingId}/leave`).catch(() => {});
    };
  }, [meetingId]);

  const refreshParticipants = () => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => {
      const active = data.participants?.filter((p: any) => !p.left_at) || [];
      setParticipants(active.map((p: any) => p.user));
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", content: text }));
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = async () => {
    if (!confirm("회의를 종료하시겠습니까? 모든 참여자가 퇴장됩니다.")) return;
    await api.post(`/meetings/${meetingId}/close`);
    navigate("/meetings");
  };

  const handleLeave = async () => {
    navigate("/meetings");
  };

  const canClose = user?.id === creatorId || user?.role === "admin" || user?.role === "superadmin";

  // Determine date separators and message grouping
  const getDateKey = (ts: string) => new Date(ts).toDateString();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#08080e',
      zIndex: 50,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: 56,
        background: '#0d0d14',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button
          onClick={handleLeave}
          style={{
            background: 'none', border: 'none', color: '#8a8a9a',
            fontSize: 20, cursor: 'pointer', padding: '4px 8px',
            marginRight: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#f0f0f5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{meetingName}</h1>
          <p style={{ fontSize: 11, color: '#5a5a6a' }}>
            {participants.length}명 참여 중
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {canClose && (
            <button
              onClick={handleClose}
              style={{
                padding: '6px 12px',
                background: 'rgba(220,80,80,0.1)',
                border: '1px solid rgba(220,80,80,0.2)',
                color: '#dc5050',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              종료
            </button>
          )}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            style={{
              background: 'none', border: 'none', color: showDrawer ? '#c9a96e' : '#6a6a7a',
              cursor: 'pointer', padding: '6px 8px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Chat area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 0',
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: '#3a3a4a',
              }}>
                <p style={{ fontSize: 14, marginBottom: 8 }}>대화를 시작해보세요</p>
                <p style={{ fontSize: 12, color: '#2a2a3a' }}>메시지를 입력하면 참여자들에게 실시간으로 전달됩니다</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const prevMsg = i > 0 ? messages[i - 1] : null;
              const showDate = !prevMsg || getDateKey(msg.timestamp) !== getDateKey(prevMsg.timestamp);
              const isSameUser = prevMsg?.type === "message" && msg.type === "message" && prevMsg.user.id === msg.user.id;
              const showAvatar = !isSameUser;
              const showName = !isSameUser;

              return (
                <div key={i}>
                  {showDate && <DateSeparator date={msg.timestamp} />}
                  {msg.type === "system" ? (
                    <SystemMessage text={msg.content} />
                  ) : (
                    <ChatMessageComponent
                      user={msg.user}
                      content={msg.content}
                      timestamp={msg.timestamp}
                      isOwn={msg.user.id === user?.id}
                      showAvatar={showAvatar}
                      showName={showName}
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '12px 16px',
            background: '#0d0d14',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '8px 12px',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요"
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f0f0f5',
                  fontSize: 14,
                  lineHeight: 1.5,
                  resize: 'none',
                  maxHeight: 120,
                  padding: 0,
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: input.trim() ? '#c9a96e' : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#05050a' : '#4a4a5a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p style={{
              fontSize: 10,
              color: '#3a3a4a',
              marginTop: 6,
              textAlign: 'center',
            }}>
              Enter로 전송 · Shift+Enter로 줄바꿈
            </p>
          </div>
        </div>

        {/* Participant drawer */}
        {showDrawer && (
          <div style={{
            width: 260,
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <ParticipantList participants={participants} onClose={() => setShowDrawer(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
