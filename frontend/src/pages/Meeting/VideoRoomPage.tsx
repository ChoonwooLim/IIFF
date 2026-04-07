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

  // Sidebar state: 'participants' | 'chat' | null
  const [sidebarTab, setSidebarTab] = useState<'participants' | 'chat'>('participants');
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);

  const mid = Number(meetingId);
  const {
    localStream, peers,
    videoEnabled, audioEnabled, screenSharing, handRaised,
    error, connectionStatus,
    currentCameraId, currentMicId,
    toggleMic, toggleCamera, toggleScreenShare, toggleHandRaise,
    changeCamera, changeMic, disconnect,
  } = useWebRTC(mid, password, joined ? joinSettings : null);

  useEffect(() => {
    api.get(`/meetings/${meetingId}`).then(({ data }) => setMeeting(data)).catch(() => {});
  }, [meetingId]);

  useEffect(() => {
    if (!joined) return;
    api.post(`/meetings/${meetingId}/join`).catch(() => {});
    return () => { api.post(`/meetings/${meetingId}/leave`).catch(() => {}); };
  }, [meetingId, joined]);

  const activeParticipants = (() => {
    const list: { id: number; nickname: string; profile_image: string | null }[] = [];
    if (user) list.push({ id: user.id, nickname: user.nickname || user.name || '나', profile_image: user.profile_image || null });
    peers.forEach(p => list.push({ id: p.userId, nickname: p.nickname, profile_image: p.profileImage }));
    return list;
  })();

  const handleJoin = useCallback((settings: JoinSettings) => {
    setJoinSettings(settings);
    setJoined(true);
  }, []);

  const handleLeave = () => { disconnect(); navigate("/meetings"); };

  const handleEndMeeting = async () => {
    disconnect();
    await api.post(`/meetings/${meetingId}/close`).catch(() => {});
    if (window.confirm("회의록을 생성하시겠습니까?")) {
      try { await api.post(`/meetings/${meetingId}/minutes`); navigate(`/meetings/${meetingId}/minutes`); return; } catch {}
    }
    navigate("/meetings");
  };

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  const isCreatorOrAdmin =
    user?.id === meeting?.creator?.id ||
    ["vvip", "admin", "superadmin"].includes(user?.role || "");

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
      <div className="top-14 md:top-[72px]" style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#05050a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{
          padding: "12px 24px", background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#ef4444", fontSize: 15,
        }}>{error}</div>
        <button onClick={() => navigate("/meetings")} style={{
          padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)", color: "#f0f0f5", fontSize: 14, cursor: "pointer",
        }}>돌아가기</button>
      </div>
    );
  }

  return (
    <div className="top-14 md:top-[72px]" style={{
      position: "fixed", left: 0, right: 0, bottom: 0,
      background: "#05050a", display: "flex", flexDirection: "column",
      zIndex: 40,
    }}>
      {/* ── Header ── */}
      <div style={{
        height: 48, padding: "0 16px",
        display: "flex", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, background: "rgba(8,8,14,0.95)", backdropFilter: "blur(8px)",
      }}>
        <button onClick={handleLeave} style={{
          background: 'none', border: 'none', color: '#8a8a9a',
          cursor: 'pointer', padding: '4px 8px', marginRight: 8, display: 'flex', alignItems: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f5" }}>
            {meeting?.name || "회의 로딩 중..."}
          </span>
          <span style={{ fontSize: 11, color: '#5a5a6a', marginLeft: 8 }}>
            {connectionStatus === 'connected'
              ? <span style={{ color: '#4ade80' }}>&#9679; 연결됨</span>
              : connectionStatus === 'connecting'
              ? <span style={{ color: '#facc15' }}>&#9679; 연결 중...</span>
              : <span style={{ color: '#ef4444' }}>&#9679; 연결 끊김</span>}
          </span>
        </div>
        {isCreatorOrAdmin && (
          <button onClick={() => setShowInvite(true)} style={{
            padding: '6px 12px', borderRadius: 6, background: 'rgba(201,169,110,0.1)',
            border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', fontSize: 12, cursor: 'pointer',
          }}>초대</button>
        )}
      </div>

      {/* ── Main area: Video + Sidebar ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Video area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: 12 }}>
          <div style={{ flex: 1, position: 'relative', minHeight: 0, borderRadius: 12, overflow: 'hidden' }}>
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
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{
          width: 320, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: '#0a0a12',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Sidebar Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
          }}>
            <button
              onClick={() => setSidebarTab('participants')}
              style={{
                flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                background: sidebarTab === 'participants' ? 'rgba(201,169,110,0.08)' : 'transparent',
                borderBottom: sidebarTab === 'participants' ? '2px solid #c9a96e' : '2px solid transparent',
                color: sidebarTab === 'participants' ? '#c9a96e' : '#5a5a6a',
                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              참가자 ({activeParticipants.length})
            </button>
            <button
              onClick={() => { setSidebarTab('chat'); setChatUnread(0); }}
              style={{
                flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                background: sidebarTab === 'chat' ? 'rgba(201,169,110,0.08)' : 'transparent',
                borderBottom: sidebarTab === 'chat' ? '2px solid #c9a96e' : '2px solid transparent',
                color: sidebarTab === 'chat' ? '#c9a96e' : '#5a5a6a',
                fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                position: 'relative',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              채팅
              {chatUnread > 0 && sidebarTab !== 'chat' && (
                <span style={{
                  position: 'absolute', top: 6, right: '20%',
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{chatUnread > 99 ? '99+' : chatUnread}</span>
              )}
            </button>
          </div>

          {/* Sidebar Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {sidebarTab === 'participants' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Participant List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                  {activeParticipants.map(p => {
                    const peerState = peers.get(p.id);
                    const isLocal = p.id === user?.id;
                    const isHandRaised = isLocal ? handRaised : (peerState?.handRaised ?? false);
                    return (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px',
                        background: isHandRaised ? 'rgba(201,169,110,0.06)' : 'transparent',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(201,169,110,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden', flexShrink: 0,
                        }}>
                          {p.profile_image ? (
                            <img src={p.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 13, color: '#c9a96e' }}>{p.nickname.charAt(0)}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 13, color: '#c0c0ca' }}>
                            {p.nickname}
                            {isLocal && <span style={{ color: '#5a5a6a', marginLeft: 4 }}>(나)</span>}
                          </span>
                        </div>
                        {isHandRaised && <span style={{ fontSize: 16 }}>&#9995;</span>}
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          {/* Audio indicator */}
                          {isLocal ? (
                            !audioEnabled && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <line x1="1" y1="1" x2="23" y2="23" />
                                <path d="M9 9v3a3 3 0 005.12 2.12" />
                              </svg>
                            )
                          ) : (
                            peerState && !peerState.audioEnabled && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <line x1="1" y1="1" x2="23" y2="23" />
                                <path d="M9 9v3a3 3 0 005.12 2.12" />
                              </svg>
                            )
                          )}
                          {/* Video indicator */}
                          {isLocal ? (
                            !videoEnabled && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <path d="M16.88 3.549L7.12 20.451" />
                                <rect x="1" y="5" width="15" height="14" rx="2" />
                              </svg>
                            )
                          ) : (
                            peerState && !peerState.videoEnabled && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <path d="M16.88 3.549L7.12 20.451" />
                                <rect x="1" y="5" width="15" height="14" rx="2" />
                              </svg>
                            )
                          )}
                        </div>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: '#4ade80', flexShrink: 0,
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* Invite button at bottom of participants */}
                {isCreatorOrAdmin && (
                  <div style={{
                    padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
                  }}>
                    <button onClick={() => setShowInvite(true)} style={{
                      width: '100%', padding: '10px 0', borderRadius: 8,
                      background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)',
                      color: '#c9a96e', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      멤버 초대
                    </button>
                  </div>
                )}
              </div>
            )}

            {sidebarTab === 'chat' && (
              <VideoChatPanel
                meetingId={mid}
                currentUserId={user?.id || 0}
                onClose={() => setSidebarTab('participants')}
                unreadCount={chatUnread}
                onResetUnread={() => setChatUnread(0)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Control Bar ── */}
      <VideoControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        screenSharing={screenSharing}
        handRaised={handRaised}
        peerCount={peers.size}
        isCreatorOrAdmin={isCreatorOrAdmin}
        showChat={sidebarTab === 'chat'}
        showParticipants={sidebarTab === 'participants'}
        chatUnread={chatUnread}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleHandRaise={toggleHandRaise}
        onToggleChat={() => setSidebarTab(sidebarTab === 'chat' ? 'participants' : 'chat')}
        onToggleParticipants={() => setSidebarTab(sidebarTab === 'participants' ? 'chat' : 'participants')}
        onOpenSettings={() => setShowSettings(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />

      {/* Modals */}
      {showSettings && (
        <DeviceSettingsModal
          currentCameraId={currentCameraId}
          currentMicId={currentMicId}
          onChangeCamera={changeCamera}
          onChangeMic={changeMic}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showInvite && meetingId && (
        <InviteModal meetingId={mid} meetingName={meeting?.name || ""} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
}
