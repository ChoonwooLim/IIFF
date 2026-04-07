import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';

interface ChatMsg {
  type: 'message' | 'system';
  user: { id: number; nickname: string; profile_image?: string | null };
  content: string;
  timestamp: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
}

interface VideoChatPanelProps {
  meetingId: number;
  currentUserId: number;
  onClose: () => void;
  unreadCount: number;
  onResetUnread: () => void;
  password?: string;
}

export default function VideoChatPanel({ meetingId, currentUserId, onClose: _, unreadCount: _u, onResetUnread, password }: VideoChatPanelProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onResetUnread();

    // Load message history
    api.get(`/meetings/${meetingId}/messages`).then(({ data }) => {
      setMessages(data.map((m: any) => ({
        type: 'message' as const,
        user: m.user,
        content: m.content,
        timestamp: m.created_at,
        file_url: m.file_url,
        file_name: m.file_name,
        file_type: m.file_type,
      })));
    }).catch(() => {});

    // Connect chat WebSocket
    const token = localStorage.getItem('access_token');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const pwParam = password ? `&password=${encodeURIComponent(password)}` : '';
    const ws = new WebSocket(`${protocol}//${host}/ws/meetings/${meetingId}?token=${token}${pwParam}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message' && data.user) {
        setMessages(prev => [...prev, {
          type: 'message',
          user: data.user,
          content: data.content || '',
          timestamp: data.timestamp || new Date().toISOString(),
          file_url: data.file_url,
          file_name: data.file_name,
          file_type: data.file_type,
        }]);
      } else if (data.type === 'user_joined') {
        setMessages(prev => [...prev, {
          type: 'system',
          user: data.user,
          content: `${data.user.nickname}님이 입장했습니다`,
          timestamp: new Date().toISOString(),
        }]);
      } else if (data.type === 'user_left') {
        setMessages(prev => [...prev, {
          type: 'system',
          user: data.user,
          content: `${data.user.nickname}님이 나갔습니다`,
          timestamp: new Date().toISOString(),
        }]);
      }
    };

    return () => {
      ws.close();
    };
  }, [meetingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'message', content: text }));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    e.target.value = '';
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/meetings/${meetingId}/chat-files`, formData);
      wsRef.current.send(JSON.stringify({
        type: 'file_message',
        file_url: data.file_url,
        file_name: data.file_name,
        file_type: data.file_type,
        file_size: data.file_size,
      }));
    } catch {
      alert('파일 업로드에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'transparent',
    }}>
      {/* Connection status */}
      {!connected && (
        <div style={{
          padding: '6px 12px', textAlign: 'center',
          background: 'rgba(239,68,68,0.06)', fontSize: 11, color: '#ef4444', flexShrink: 0,
        }}>채팅 연결 중...</div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 12px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 12px', color: '#3a3a4a', fontSize: 13 }}>
            채팅을 시작해보세요
          </div>
        )}
        {messages.map((msg, i) => {
          if (msg.type === 'system') {
            return (
              <div key={i} style={{
                textAlign: 'center', fontSize: 11, color: '#4a4a5a',
                padding: '4px 0',
              }}>
                {msg.content}
              </div>
            );
          }
          const isOwn = msg.user.id === currentUserId;
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isOwn ? 'flex-end' : 'flex-start',
            }}>
              {!isOwn && (
                <span style={{ fontSize: 11, color: '#6a6a7a', marginBottom: 2, marginLeft: 4 }}>
                  {msg.user.nickname}
                </span>
              )}
              <div style={{
                maxWidth: '85%', padding: '8px 12px', borderRadius: 10,
                background: isOwn ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isOwn ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                {msg.file_url ? (
                  msg.file_type?.startsWith('image/') ? (
                    <img src={msg.file_url} alt={msg.file_name || ''} style={{
                      maxWidth: '100%', maxHeight: 200, borderRadius: 6,
                    }} />
                  ) : (
                    <a href={msg.file_url} target="_blank" rel="noreferrer" style={{
                      color: '#c9a96e', fontSize: 13, textDecoration: 'underline',
                    }}>
                      {msg.file_name || '파일'}
                    </a>
                  )
                ) : (
                  <p style={{
                    fontSize: 13, color: '#e0e0ea', lineHeight: 1.5,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                  }}>
                    {msg.content}
                  </p>
                )}
              </div>
              <span style={{ fontSize: 10, color: '#3a3a4a', marginTop: 2, marginLeft: 4, marginRight: 4 }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '6px 10px',
        }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!connected || isUploading}
            style={{
              background: 'none', border: 'none', color: '#5a5a6a',
              cursor: 'pointer', padding: 2, display: 'flex',
            }}
          >
            {isUploading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31 31" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            )}
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? '메시지 입력' : '연결 중...'}
            disabled={!connected}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              outline: 'none', color: '#f0f0f5', fontSize: 13,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            style={{
              background: 'none', border: 'none',
              color: input.trim() && connected ? '#c9a96e' : '#3a3a4a',
              cursor: input.trim() && connected ? 'pointer' : 'default',
              padding: 2, display: 'flex',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
