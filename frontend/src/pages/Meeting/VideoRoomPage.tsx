import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

interface MeetingDetail {
  id: number;
  name: string;
  jitsi_room_id: string;
  status: string;
  creator: { id: number; nickname: string };
}

export default function VideoRoomPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeeting(data));
    api.post(`/meetings/${meetingId}/join`).catch(() => {});
    return () => { api.post(`/meetings/${meetingId}/leave`).catch(() => {}); };
  }, [meetingId]);

  const handleClose = async () => {
    await api.post(`/meetings/${meetingId}/close`);
    navigate("/meetings");
  };

  if (!meeting) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  const jitsiUrl = `https://meet.jit.si/${meeting.jitsi_room_id}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl text-white font-bold">{meeting.name}</h1>
        <div className="flex gap-2">
          {(user?.id === meeting.creator.id || ["admin", "superadmin"].includes(user?.role || "")) && (
            <button onClick={handleClose} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
              회의 종료
            </button>
          )}
          <button onClick={() => navigate("/meetings")} className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm">
            나가기
          </button>
        </div>
      </div>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe src={jitsiUrl} className="w-full h-full" allow="camera; microphone; display-capture" allowFullScreen />
      </div>
    </div>
  );
}
