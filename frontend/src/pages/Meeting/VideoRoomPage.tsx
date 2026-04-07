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

      {/* ── Main area: Video + Thumbnails + Chat ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Video area (main large view) */}
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

        {/* ── Participant Thumbnails Panel ── */}
        <div style={{
          width: 300, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: '#08080f',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Header */}
          <div style={{
            padding: '10px 14px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c9a96e', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              참가자 ({activeParticipants.length})
            </span>
            {isCreatorOrAdmin && (
              <button onClick={() => setShowInvite(true)} style={{
                padding: '4px 10px', borderRadius: 6, background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', fontSize: 11, cursor: 'pointer',
              }}>+ 초대</button>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoRows: 'minmax(0, 1fr)',
            gap: 6,
            alignContent: 'start',
          }}>
            {/* Local user thumbnail */}
            {(() => {
              const isHandUp = handRaised;
              return (
                <div key="local" style={{
                  aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden',
                  position: 'relative', background: '#0c0c18',
                  border: isHandUp ? '2px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                  {localStream && videoEnabled ? (
                    <video
                      ref={(el) => { if (el && localStream) el.srcObject = localStream; }}
                      autoPlay playsInline muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,169,110,0.15)',
                        border: '1.5px solid rgba(201,169,110,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: '#c9a96e',
                      }}>
                        {(user?.nickname || user?.name || '나').charAt(0)}
                      </div>
                    </div>
                  )}
                  {/* Name + status overlay */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <span style={{ fontSize: 10, color: '#e0e0ea', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.nickname || user?.name || '나'} (나)
                    </span>
                    {!audioEnabled && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                        <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12" />
                      </svg>
                    )}
                  </div>
                  {isHandUp && (
                    <div style={{
                      position: 'absolute', top: 3, right: 3, fontSize: 12,
                      background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '1px 3px',
                    }}>&#9995;</div>
                  )}
                </div>
              );
            })()}

            {/* Remote peer thumbnails */}
            {Array.from(peers.values()).map(peer => {
              const isHandUp = peer.handRaised;
              return (
                <div key={peer.userId} style={{
                  aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden',
                  position: 'relative', background: '#0c0c18',
                  border: isHandUp ? '2px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                  {peer.stream && peer.videoEnabled ? (
                    <video
                      ref={(el) => { if (el && peer.stream) el.srcObject = peer.stream; }}
                      autoPlay playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,169,110,0.15)',
                        border: '1.5px solid rgba(201,169,110,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: '#c9a96e',
                      }}>
                        {peer.nickname.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <span style={{ fontSize: 10, color: '#e0e0ea', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {peer.nickname}
                    </span>
                    {!peer.audioEnabled && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                        <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12" />
                      </svg>
                    )}
                  </div>
                  {isHandUp && (
                    <div style={{
                      position: 'absolute', top: 3, right: 3, fontSize: 12,
                      background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '1px 3px',
                    }}>&#9995;</div>
                  )}
                </div>
              );
            })}

            {/* Empty placeholder slots (always show at least 6 total slots) */}
            {Array.from({ length: Math.max(0, 6 - activeParticipants.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{
                aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden',
                background: '#0c0c18', border: '1px dashed rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat Panel (always visible) ── */}
        <div style={{
          width: 300, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: '#0a0a12',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '10px 14px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c9a96e' }}>채팅</span>
            {chatUnread > 0 && (
              <span style={{
                minWidth: 18, height: 18, borderRadius: 9,
                background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>{chatUnread > 99 ? '99+' : chatUnread}</span>
            )}
          </div>

          {/* Chat Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <VideoChatPanel
              meetingId={mid}
              currentUserId={user?.id || 0}
              onClose={() => {}}
              unreadCount={chatUnread}
              onResetUnread={() => setChatUnread(0)}
            />
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
        showChat={false}
        showParticipants={false}
        chatUnread={chatUnread}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleHandRaise={toggleHandRaise}
        onToggleChat={() => {}}
        onToggleParticipants={() => {}}
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
