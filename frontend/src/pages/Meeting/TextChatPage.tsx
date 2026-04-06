import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import ChatMessageComponent, { SystemMessage, DateSeparator } from "@/components/meeting/ChatMessage";
import ParticipantList from "@/components/meeting/ParticipantList";
import InviteModal from "@/components/meeting/InviteModal";

interface ChatMsg {
  type: "message" | "system";
  user: { id: number; nickname: string; profile_image?: string | null };
  content: string;
  timestamp: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
}

export default function TextChatPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const roomPassword = searchParams.get("password") || "";
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [participants, setParticipants] = useState<{ id: number; nickname: string; profile_image: string | null }[]>([]);
  const [input, setInput] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    api.get(`/meetings/${meetingId}`).then(({ data }) => {
      if (cancelled) return;
      setMeetingName(data.name);
      setCreatorId(data.creator?.id ?? null);
    }).catch(() => {
      if (!cancelled) setWsError("회의실을 찾을 수 없습니다");
    });

    api.get(`/meetings/${meetingId}/messages`).then(({ data }) => {
      if (cancelled) return;
      setMessages(data.map((m: any) => ({
        type: "message" as const,
        user: m.user,
        content: m.content,
        timestamp: m.created_at,
        file_url: m.file_url,
        file_name: m.file_name,
        file_type: m.file_type,
        file_size: m.file_size,
      })));
    });

    const token = localStorage.getItem("access_token");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/meetings/${meetingId}?token=${token}${roomPassword ? `&password=${encodeURIComponent(roomPassword)}` : ''}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (cancelled) { ws.close(); return; }
      setWsConnected(true);
      setWsError("");
    };

    ws.onclose = (e) => {
      if (cancelled) return;
      setWsConnected(false);
      if (e.code === 4006) {
        setWsError("초대받지 않은 회의실입니다");
      } else if (e.code === 4003) {
        setWsError("로그인이 필요합니다");
      } else if (e.code !== 1000 && e.code !== 1006) {
        setWsError("연결이 끊어졌습니다");
      }
    };

    ws.onerror = () => {
      if (!cancelled) setWsConnected(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message" && data.user) {
        setMessages((prev) => [...prev, {
          type: "message",
          user: data.user,
          content: data.content || "",
          timestamp: data.timestamp || new Date().toISOString(),
          file_url: data.file_url,
          file_name: data.file_name,
          file_type: data.file_type,
          file_size: data.file_size,
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
      cancelled = true;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
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
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    e.target.value = "";

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(`/meetings/${meetingId}/chat-files`, formData);
      wsRef.current.send(JSON.stringify({
        type: "file_message",
        file_url: data.file_url,
        file_name: data.file_name,
        file_type: data.file_type,
        file_size: data.file_size,
      }));
    } catch (err: any) {
      const detail = err.response?.data?.detail || "파일 업로드에 실패했습니다";
      alert(detail);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("회의를 종료하시겠습니까? 모든 참여자가 퇴장됩니다.")) return;
    await api.post(`/meetings/${meetingId}/close`);
    if (confirm("회의록을 생성하시겠습니까?")) {
      try {
        await api.post(`/meetings/${meetingId}/minutes`);
        navigate(`/meetings/${meetingId}/minutes`);
        return;
      } catch {
        // minutes generation failed, go to list
      }
    }
    navigate("/meetings");
  };

  const canManage = user?.id === creatorId || user?.role === "admin" || user?.role === "superadmin";

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
      justifyContent: 'center',
      background: '#05050a',
      zIndex: 9999,
    }}>
      {/* Chat container */}
      <div style={{
        width: '100%',
        maxWidth: 940,
        display: 'flex',
        flexDirection: 'column',
        background: '#08080e',
        borderLeft: '1px solid rgba(255,255,255,0.04)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          height: 56,
          background: '#0d0d14',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => navigate("/meetings")}
            style={{
              background: 'none', border: 'none', color: '#8a8a9a',
              cursor: 'pointer', padding: '4px 8px', marginRight: 4,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: 15, fontWeight: 600, color: '#f0f0f5',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{meetingName}</h1>
            <p style={{ fontSize: 11, color: '#5a5a6a' }}>
              {participants.length}명 참여 중
              {!wsConnected && wsError && <span style={{ color: '#dc5050', marginLeft: 6 }}>· 연결 끊김</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {canManage && (
              <button
                onClick={() => setShowInvite(true)}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(201,169,110,0.1)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: '#c9a96e', fontSize: 12, cursor: 'pointer',
                }}
              >
                초대
              </button>
            )}
            {canManage && (
              <button
                onClick={handleClose}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(220,80,80,0.1)',
                  border: '1px solid rgba(220,80,80,0.2)',
                  color: '#dc5050', fontSize: 12, cursor: 'pointer',
                }}
              >
                종료
              </button>
            )}
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              style={{
                background: 'none', border: 'none',
                color: showDrawer ? '#c9a96e' : '#6a6a7a',
                cursor: 'pointer', padding: '6px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error banner */}
        {wsError && (
          <div style={{
            padding: '10px 16px',
            background: 'rgba(220,80,80,0.08)',
            borderBottom: '1px solid rgba(220,80,80,0.15)',
            color: '#dc5050',
            fontSize: 13,
            textAlign: 'center',
            animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {wsError}
            <button
              onClick={() => navigate("/meetings")}
              style={{
                marginLeft: 12,
                padding: '2px 10px',
                background: 'rgba(220,80,80,0.15)',
                border: '1px solid rgba(220,80,80,0.3)',
                color: '#dc5050',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              돌아가기
            </button>
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
        }}>
          {messages.length === 0 && !wsError && (
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
                    showAvatar={!isSameUser}
                    showName={!isSameUser}
                    fileUrl={msg.file_url}
                    fileName={msg.file_name}
                    fileType={msg.file_type}
                    fileSize={msg.file_size}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '8px 12px',
            opacity: wsConnected ? 1 : 0.4,
            transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!wsConnected || isUploading}
              style={{
                background: 'none', border: 'none', cursor: wsConnected ? 'pointer' : 'default',
                color: '#6a6a7a', padding: '4px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { if (wsConnected) e.currentTarget.style.color = '#c9a96e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6a6a7a'; }}
              title="파일 첨부"
            >
              {isUploading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31 31" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              )}
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={wsConnected ? "메시지를 입력하세요" : "연결 중..."}
              disabled={!wsConnected}
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
              onClick={(e) => {
                if (input.trim() && wsConnected) {
                  e.currentTarget.style.animation = 'none';
                  void e.currentTarget.offsetHeight;
                  e.currentTarget.style.animation = 'sendPulse 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                handleSend();
              }}
              disabled={!input.trim() || !wsConnected}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: input.trim() && wsConnected ? '#c9a96e' : 'rgba(255,255,255,0.06)',
                border: 'none',
                cursor: input.trim() && wsConnected ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && wsConnected ? '#05050a' : '#4a4a5a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: 10, color: '#3a3a4a', marginTop: 6, textAlign: 'center' }}>
            Enter로 전송 · Shift+Enter로 줄바꿈
          </p>
        </div>
      </div>

      {/* Participant drawer — overlay */}
      {showDrawer && (
        <div
          onClick={() => setShowDrawer(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'flex-end',
            animation: 'backdropFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 280, maxWidth: '80vw', height: '100%',
              animation: 'drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <ParticipantList participants={participants} onClose={() => setShowDrawer(false)} />
          </div>
        </div>
      )}

      {/* Invite modal */}
      {showInvite && meetingId && (
        <InviteModal
          meetingId={Number(meetingId)}
          meetingName={meetingName}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
