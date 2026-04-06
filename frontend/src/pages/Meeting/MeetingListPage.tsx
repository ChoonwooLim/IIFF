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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-display text-3xl text-gold">회의실</h1>
        {user && (
          <button onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">
            회의실 만들기
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card p-6 mb-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="회의실 이름"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" required />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="radio" name="type" checked={type === "text"} onChange={() => setType("text")} />
              💬 텍스트 채팅
            </label>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="radio" name="type" checked={type === "video"} onChange={() => setType("video")} />
              🎥 화상 회의
            </label>
          </div>
          <button type="submit" className="px-6 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">생성</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((m) => (
          <MeetingCard key={m.id} id={m.id} name={m.name} type={m.type}
            participantCount={m.participant_count} maxParticipants={m.max_participants}
            creator={m.creator} createdAt={m.created_at} />
        ))}
        {meetings.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-12">활성화된 회의실이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
