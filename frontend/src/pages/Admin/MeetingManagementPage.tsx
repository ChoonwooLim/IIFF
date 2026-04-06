import { useState, useEffect } from "react";
import api from "@/services/api";

interface MeetingItem {
  id: number;
  name: string;
  type: string;
  status: string;
  creator_nickname: string;
  participant_count: number;
  created_at: string;
}

export default function MeetingManagementPage() {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchMeetings = () => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status_filter = statusFilter;
    api.get("/admin/meetings", { params }).then(({ data }) => setMeetings(data));
  };

  useEffect(() => { fetchMeetings(); }, [statusFilter]);

  const closeMeeting = async (meetingId: number) => {
    await api.post(`/admin/meetings/${meetingId}/close`);
    fetchMeetings();
  };

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">회의실 관리</h1>

      <div className="flex gap-2 mb-6">
        {["", "active", "closed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              statusFilter === s ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"
            }`}>
            {s === "" ? "전체" : s === "active" ? "활성" : "종료"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">회의실명</th>
              <th className="py-3 px-2">타입</th>
              <th className="py-3 px-2">개설자</th>
              <th className="py-3 px-2">참여자</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">생성일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white">{m.name}</td>
                <td className="py-3 px-2 text-gray-400">{m.type === "video" ? "화상" : "텍스트"}</td>
                <td className="py-3 px-2 text-gray-400">{m.creator_nickname}</td>
                <td className="py-3 px-2 text-gray-400">{m.participant_count}명</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    m.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {m.status === "active" ? "활성" : "종료"}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {m.created_at ? new Date(m.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  {m.status === "active" && (
                    <button onClick={() => closeMeeting(m.id)}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">종료</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
