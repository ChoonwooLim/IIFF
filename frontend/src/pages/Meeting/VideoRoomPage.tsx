import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import useWebRTC from "@/hooks/useWebRTC";
import VideoGrid from "@/components/meeting/VideoGrid";
import VideoControlBar from "@/components/meeting/VideoControlBar";
import PreJoinLobby from "@/components/meeting/PreJoinLobby";
import VideoChatPanel from "@/components/meeting/VideoChatPanel";
import DeviceSettingsModal from "@/components/meeting/DeviceSettingsModal";
import ParticipantList from "@/components/meeting/ParticipantList";
import InviteModal from "@/components/meeting/InviteModal";

interface MeetingDetail {
  id: number;
  name: string;
  status: string;
  creator: { id: number; nickname: string };
  participants?: Array<{ user: { id: number; nickname: string; profile_image: string | null }; left_at: string | null }>;
}

interface JoinSettings {
  audioDeviceId: string;
  videoDeviceId: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export default function VideoRoomPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const password = searchParams.get("password") || undefined;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [joinSettings, setJoinSettings] = useState<JoinSettings | null>(null);
  const [joined, setJoined] = useState(false);

  // Side panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);

  const mid = Number(meetingId);
  const {
    localStream,
    peers,
    videoEnabled,
    audioEnabled,
    screenSharing,
    handRaised,
    error,
    connectionStatus,
    currentCameraId,
    currentMicId,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    toggleHandRaise,
    changeCamera,
    changeMic,
    disconnect,
  } = useWebRTC(mid, password, joined ? joinSettings : null);

  // Fetch meeting details
  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeeting(data)).catch(() => {});
  }, [meetingId]);

  // Join/leave REST API
  useEffect(() => {
    if (!joined) return;
    api.post(`/meetings/${meetingId}/join`).catch(() => {});
    return () => {
      api.post(`/meetings/${meetingId}/leave`).catch(() => {});
    };
  }, [meetingId, joined]);

  // Get active participants for sidebar
  const activeParticipants = (() => {
    const list: { id: number; nickname: string; profile_image: string | null }[] = [];
    // Add self
    if (user) {
      list.push({ id: user.id, nickname: user.nickname || user.name || '나', profile_image: user.profile_image || null });
    }
    // Add peers
    peers.forEach(p => {
      list.push({ id: p.userId, nickname: p.nickname, profile_image: p.profileImage });
    });
    return list;
  })();

  const handleJoin = useCallback((settings: JoinSettings) => {
    setJoinSettings(settings);
    setJoined(true);
  }, []);

  const handleLeave = () => {
    disconnect();
    navigate("/meetings");
  };

  const handleEndMeeting = async () => {
    disconnect();
    await api.post(`/meetings/${meetingId}/close`).catch(() => {});
    if (window.confirm("회의록을 생성하시겠습니까?")) {
      try {
        await api.post(`/meetings/${meetingId}/minutes`);
        navigate(`/meetings/${meetingId}/minutes`);
        return;
      } catch {
        // minutes generation failed
      }
    }
    navigate("/meetings");
  };

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const isCreatorOrAdmin =
    user?.id === meeting?.creator?.id ||
    ["admin", "superadmin"].includes(user?.role || "");

  // Pre-join lobby
  if (!joined) {
    return (
      <PreJoinLobby
        meetingName={meeting?.name || "화상 회의"}
        onJoin={handleJoin}
        onCancel={() => navigate("/meetings")}
      />
    );
  }

  // Error state
  if (error && connectionStatus === 'disconnected') {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "#05050a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{
          padding: "12px 24px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 12, color: "#ef4444", fontSize: 15,
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate("/meetings")}
          style={{
            padding: "10px 24px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#f0f0f5", fontSize: 14, cursor: "pointer",
          }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "#05050a",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        height: 48,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        background: "rgba(8,8,14,0.9)",
        backdropFilter: "blur(8px)",
      }}>
        {/* Left: back + title */}
        <button
          onClick={handleLeave}
          style={{
            background: 'none', border: 'none', color: '#8a8a9a',
            cursor: 'pointer', padding: '4px 8px', marginRight: 8,
            display: 'flex', alignItems: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f5" }}>
            {meeting?.name || "회의 로딩 중..."}
          </span>
          <span style={{ fontSize: 11, color: '#5a5a6a', marginLeft: 8 }}>
            {connectionStatus === 'connected' ? (
              <span style={{ color: '#4ade80' }}>&#9679; 연결됨</span>
            ) : connectionStatus === 'connecting' ? (
              <span style={{ color: '#facc15' }}>&#9679; 연결 중...</span>
            ) : (
              <span style={{ color: '#ef4444' }}>&#9679; 연결 끊김</span>
            )}
          </span>
        </div>

        {/* Right: invite button */}
        {isCreatorOrAdmin && (
          <button
            onClick={() => setShowInvite(true)}
            style={{
              padding: '6px 12px', borderRadius: 6,
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.2)',
              color: '#c9a96e', fontSize: 12, cursor: 'pointer',
              marginRight: 8,
            }}
          >
            초대
          </button>
        )}
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Video Grid */}
        <div style={{ flex: 1, overflow: "hidden", paddingBottom: 72, position: "relative", minWidth: 0 }}>
          <VideoGrid
            localStream={localStream}
            localNickname={user?.nickname || user?.name || "나"}
            localProfileImage={user?.profile_image || null}
            localVideoEnabled={videoEnabled}
            localAudioEnabled={audioEnabled}
            localHandRaised={handRaised}
            screenSharing={screenSharing}
            peers={peers}
          />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <VideoChatPanel
            meetingId={mid}
            currentUserId={user?.id || 0}
            onClose={() => setShowChat(false)}
            unreadCount={chatUnread}
            onResetUnread={() => setChatUnread(0)}
          />
        )}

        {/* Participant Panel */}
        {showParticipants && (
          <div style={{
            width: 280, height: '100%',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <ParticipantList
              participants={activeParticipants}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        )}
      </div>

      {/* Control Bar */}
      <VideoControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        screenSharing={screenSharing}
        handRaised={handRaised}
        peerCount={peers.size}
        isCreatorOrAdmin={isCreatorOrAdmin}
        showChat={showChat}
        showParticipants={showParticipants}
        chatUnread={chatUnread}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleHandRaise={toggleHandRaise}
        onToggleChat={() => { setShowChat(!showChat); setShowParticipants(false); }}
        onToggleParticipants={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
        onOpenSettings={() => setShowSettings(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />

      {/* Device Settings Modal */}
      {showSettings && (
        <DeviceSettingsModal
          currentCameraId={currentCameraId}
          currentMicId={currentMicId}
          onChangeCamera={changeCamera}
          onChangeMic={changeMic}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Invite Modal */}
      {showInvite && meetingId && (
        <InviteModal
          meetingId={mid}
          meetingName={meeting?.name || ""}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
