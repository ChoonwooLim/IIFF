import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import ChatMessageComponent from "@/components/meeting/ChatMessage";
import ParticipantList from "@/components/meeting/ParticipantList";

interface Message {
  type: string;
  user?: { id: number; nickname: string };
  content?: string;
  timestamp?: string;
  users?: { id: number; nickname: string; profile_image: string | null }[];
}

export default function TextChatPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ user: { id: number; nickname: string }; content: string; timestamp: string }[]>([]);
  const [participants, setParticipants] = useState<{ id: number; nickname: string; profile_image: string | null }[]>([]);
  const [input, setInput] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeetingName(data.name));
    api.get(`/meetings/${meetingId}/messages`).then(({ data }) => {
      setMessages(data.map((m: any) => ({
        user: m.user,
        content: m.content,
        timestamp: m.created_at,
      })));
    });

    const token = localStorage.getItem("access_token");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws/meetings/${meetingId}?token=${token}`);

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      if (data.type === "new_message" && data.user && data.content) {
        setMessages((prev) => [...prev, {
          user: data.user!,
          content: data.content!,
          timestamp: data.timestamp || new Date().toISOString(),
        }]);
      } else if (data.type === "participants" && data.users) {
        setParticipants(data.users);
      } else if (data.type === "user_joined" || data.type === "user_left") {
        api.get(`/meetings/${meetingId}`).then(({ data }) => {
          const active = data.participants?.filter((p: any) => !p.left_at) || [];
          setParticipants(active.map((p: any) => p.user));
        });
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      api.post(`/meetings/${meetingId}/leave`).catch(() => {});
    };
  }, [meetingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", content: input }));
    setInput("");
  };

  const handleClose = async () => {
    await api.post(`/meetings/${meetingId}/close`);
    navigate("/meetings");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-4 h-[calc(100vh-120px)]">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-white font-bold">{meetingName}</h1>
          <div className="flex gap-2">
            <button onClick={handleClose} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">종료</button>
            <button onClick={() => navigate("/meetings")} className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm">나가기</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          {messages.map((msg, i) => (
            <ChatMessageComponent key={i} user={msg.user} content={msg.content}
              timestamp={msg.timestamp} isOwn={msg.user.id === user?.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <button onClick={handleSend}
            className="px-6 py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg">전송</button>
        </div>
      </div>

      <div className="w-64 hidden lg:block">
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
}
