import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import useWebRTC from "@/hooks/useWebRTC";
import VideoGrid from "@/components/meeting/VideoGrid";
import VideoControlBar from "@/components/meeting/VideoControlBar";

interface MeetingDetail {
  id: number;
  name: string;
  status: string;
  creator: { id: number; nickname: string };
}

export default function VideoRoomPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const password = searchParams.get("password") || undefined;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);

  const mid = Number(meetingId);
  const {
    localStream,
    peers,
    videoEnabled,
    audioEnabled,
    screenSharing,
    error,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    disconnect,
  } = useWebRTC(mid, password);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeeting(data));
    api.post(`/meetings/${meetingId}/join`).catch(() => {});
    return () => {
      api.post(`/meetings/${meetingId}/leave`).catch(() => {});
    };
  }, [meetingId]);

  const handleLeave = () => {
    disconnect();
    navigate("/meetings");
  };

  const handleEndMeeting = async () => {
    disconnect();
    await api.post(`/meetings/${meetingId}/close`).catch(() => {});
    navigate("/meetings");
  };

  const isCreatorOrAdmin =
    user?.id === meeting?.creator?.id ||
    ["admin", "superadmin"].includes(user?.role || "");

  if (error) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#05050a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}>
        <div style={{
          padding: "12px 24px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 12,
          color: "#ef4444",
          fontSize: 15,
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate("/meetings")}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#f0f0f5",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      background: "#05050a",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        height: 48,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f5" }}>
          {meeting?.name || "회의 로딩 중..."}
        </span>
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, overflow: "hidden", paddingBottom: 72 }}>
        <VideoGrid
          localStream={localStream}
          localNickname={user?.nickname || user?.name || "나"}
          localProfileImage={user?.profile_image || null}
          localVideoEnabled={videoEnabled}
          localAudioEnabled={audioEnabled}
          screenSharing={screenSharing}
          peers={peers}
        />
      </div>

      {/* Control Bar */}
      <VideoControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        screenSharing={screenSharing}
        peerCount={peers.size}
        isCreatorOrAdmin={isCreatorOrAdmin}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />
    </div>
  );
}
