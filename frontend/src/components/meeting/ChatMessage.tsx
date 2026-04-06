interface Props {
  user: { id: number; nickname: string };
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function ChatMessage({ user, content, timestamp, isOwn }: Props) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[70%] ${isOwn ? "bg-[var(--color-gold)]/20" : "bg-white/10"} rounded-lg px-4 py-2`}>
        {!isOwn && <p className="text-xs text-[var(--color-gold)] mb-1">{user.nickname}</p>}
        <p className="text-sm text-gray-200">{content}</p>
        <p className="text-[10px] text-gray-600 mt-1">{new Date(timestamp).toLocaleTimeString("ko-KR")}</p>
      </div>
    </div>
  );
}
