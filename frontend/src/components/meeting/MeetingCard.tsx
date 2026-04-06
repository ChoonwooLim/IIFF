import { Link } from "react-router-dom";

interface MeetingCardProps {
  id: number;
  name: string;
  type: "video" | "text";
  participantCount: number;
  maxParticipants: number;
  creator: { nickname: string };
  createdAt: string;
}

export default function MeetingCard({ id, name, type, participantCount, maxParticipants, creator, createdAt }: MeetingCardProps) {
  const icon = type === "video" ? "🎥" : "💬";
  const path = type === "video" ? `/meetings/video/${id}` : `/meetings/chat/${id}`;

  return (
    <Link to={path} className="glass-card p-5 hover:border-[var(--color-gold)]/30 transition block">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-white font-semibold truncate">{name}</h3>
        <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400 ml-auto">
          {type === "video" ? "화상" : "텍스트"}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{creator.nickname}</span>
        <span>{participantCount}/{maxParticipants}명</span>
        <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
      </div>
    </Link>
  );
}
