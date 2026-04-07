import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import useWebRTC, { type PeerState } from "@/hooks/useWebRTC";
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

/* ── Spotlight slot video cell ── */
function SpotlightCell({
  stream, nickname, profileImage, videoOn, audioOn, isLocal, handRaised,
}: {
  stream: MediaStream | null; nickname: string; profileImage: string | null;
  videoOn: boolean; audioOn: boolean; isLocal: boolean; handRaised: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (vidRef.current && stream) vidRef.current.srcObject = stream; }, [stream]);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#0a0a14', borderRadius: 10, overflow: 'hidden',
      border: handRaised ? '2px solid rgba(201,169,110,0.6)' : '1px solid rgba(255,255,255,0.08)',
    }}>
      {stream && videoOn ? (
        <video ref={vidRef} autoPlay playsInline muted={isLocal} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: isLocal ? 'scaleX(-1)' : 'none',
        }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {profileImage ? (
            <img src={profileImage} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(201,169,110,0.15)', border: '2px solid rgba(201,169,110,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#c9a96e',
            }}>{nickname.charAt(0)}</div>
          )}
        </div>
      )}
      {/* Name overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 10px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, color: '#e0e0ea', fontWeight: 500 }}>
          {nickname}{isLocal ? ' (나)' : ''}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          {handRaised && <span style={{ fontSize: 14 }}>&#9995;</span>}
          {!audioOn && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12" />
            </svg>
          )}
          {!videoOn && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M16.88 3.549L7.12 20.451" /><rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
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

  // Spotlight: 4 slots, each holds a userId or null
  const [spotlightSlots, setSpotlightSlots] = useState<(number | null)[]>([null, null, null, null]);
  // Picker state: which slot index is being assigned (-1 = none)
  const [pickerForSlot, setPickerForSlot] = useState(-1);

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

  // All participant IDs
  const localUserId = user?.id ?? 0;
  const allParticipantIds = [localUserId, ...Array.from(peers.keys())];

  // Auto-fill spotlight slots when participants change
  useEffect(() => {
    setSpotlightSlots(prev => {
      const next = [...prev];
      // Remove IDs that are no longer present
      for (let i = 0; i < 4; i++) {
        if (next[i] !== null && !allParticipantIds.includes(next[i]!)) {
          next[i] = null;
        }
      }
      // Auto-assign unassigned participants to empty slots
      for (const pid of allParticipantIds) {
        if (next.includes(pid)) continue; // already in a slot
        const emptyIdx = next.indexOf(null);
        if (emptyIdx === -1) break; // no empty slots
        next[emptyIdx] = pid;
      }
      return next;
    });
  }, [localUserId, peers.size]);

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

  // Assign a participant to a spotlight slot
  const assignToSlot = (slotIdx: number, userId: number) => {
    setSpotlightSlots(prev => {
      const next = [...prev];
      // Remove this user from any existing slot
      const existingIdx = next.indexOf(userId);
      if (existingIdx !== -1) next[existingIdx] = null;
      // If slot already has someone, swap
      const displaced = next[slotIdx];
      next[slotIdx] = userId;
      if (displaced !== null && existingIdx !== -1) {
        next[existingIdx] = displaced;
      }
      return next;
    });
    setPickerForSlot(-1);
  };

  const clearSlot = (slotIdx: number) => {
    setSpotlightSlots(prev => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  };

  // Get participant info for rendering
  const getSlotInfo = (userId: number): {
    stream: MediaStream | null; nickname: string; profileImage: string | null;
    videoOn: boolean; audioOn: boolean; isLocal: boolean; handUp: boolean;
  } => {
    if (userId === localUserId) {
      return {
        stream: localStream, nickname: user?.nickname || user?.name || '나',
        profileImage: user?.profile_image || null,
        videoOn: videoEnabled, audioOn: audioEnabled, isLocal: true, handUp: handRaised,
      };
    }
    const peer = peers.get(userId);
    if (!peer) return { stream: null, nickname: '?', profileImage: null, videoOn: false, audioOn: false, isLocal: false, handUp: false };
    return {
      stream: peer.stream, nickname: peer.nickname, profileImage: peer.profileImage,
      videoOn: peer.videoEnabled, audioOn: peer.audioEnabled, isLocal: false, handUp: peer.handRaised,
    };
  };

  // Participants NOT in any spotlight slot (available for picking)
  const unassignedParticipants = activeParticipants.filter(p => !spotlightSlots.includes(p.id));

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

      {/* ── Main area: 2x2 Spotlight + Right Sidebar ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ── 2x2 Spotlight Grid ── */}
        <div style={{
          flex: 1, minWidth: 0, padding: 10,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8,
        }}>
          {spotlightSlots.map((slotUserId, idx) => (
            <div key={idx} style={{ position: 'relative', minHeight: 0, minWidth: 0 }}>
              {slotUserId !== null ? (
                <>
                  <SpotlightCell {...getSlotInfo(slotUserId)} />
                  {/* Clear / swap button */}
                  <button
                    onClick={() => clearSlot(idx)}
                    title="슬롯 비우기"
                    style={{
                      position: 'absolute', top: 6, right: 6, zIndex: 2,
                      width: 24, height: 24, borderRadius: 6,
                      background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#8a8a9a', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, lineHeight: 1, padding: 0,
                      opacity: 0.5, transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
                  >&times;</button>
                </>
              ) : (
                /* Empty slot — click to assign */
                <div
                  onClick={() => setPickerForSlot(pickerForSlot === idx ? -1 : idx)}
                  style={{
                    width: '100%', height: '100%', borderRadius: 10,
                    background: '#0a0a14',
                    border: pickerForSlot === idx
                      ? '2px solid rgba(201,169,110,0.4)'
                      : '1px dashed rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                    cursor: 'pointer', transition: 'border 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0e0e1a'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0a0a14'; }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke={pickerForSlot === idx ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.12)'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" />
                  </svg>
                  <span style={{ fontSize: 12, color: pickerForSlot === idx ? '#c9a96e' : '#3a3a4a' }}>
                    {pickerForSlot === idx ? '아래에서 선택' : '클릭하여 배치'}
                  </span>
                </div>
              )}

              {/* Participant picker dropdown */}
              {pickerForSlot === idx && (
                <div style={{
                  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                  zIndex: 10, minWidth: 200, maxHeight: 180, overflowY: 'auto',
                  background: 'rgba(12,12,24,0.97)', border: '1px solid rgba(201,169,110,0.25)',
                  borderRadius: 10, padding: 6, backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                  {unassignedParticipants.length === 0 ? (
                    <div style={{ padding: '12px 8px', textAlign: 'center', color: '#5a5a6a', fontSize: 12 }}>
                      배치 가능한 참가자 없음
                    </div>
                  ) : (
                    unassignedParticipants.map(p => (
                      <button
                        key={p.id}
                        onClick={(e) => { e.stopPropagation(); assignToSlot(idx, p.id); }}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: 6,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 8,
                          color: '#c0c0ca', fontSize: 13, textAlign: 'left',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: 'rgba(201,169,110,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                        }}>
                          {p.profile_image ? (
                            <img src={p.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 12, color: '#c9a96e' }}>{p.nickname.charAt(0)}</span>
                          )}
                        </div>
                        {p.nickname}{p.id === localUserId ? ' (나)' : ''}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Participant Thumbnails Panel ── */}
        <div style={{
          width: 240, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: '#08080f',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Header */}
          <div style={{
            padding: '8px 12px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#c9a96e', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              참가자 ({activeParticipants.length})
            </span>
            {isCreatorOrAdmin && (
              <button onClick={() => setShowInvite(true)} style={{
                padding: '3px 8px', borderRadius: 5, background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', fontSize: 10, cursor: 'pointer',
              }}>+ 초대</button>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 6,
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5,
            alignContent: 'start',
          }}>
            {/* Local */}
            {(() => {
              const inSpotlight = spotlightSlots.includes(localUserId);
              return (
                <ThumbnailCell
                  key="local"
                  stream={localStream} nickname={user?.nickname || user?.name || '나'}
                  profileImage={user?.profile_image || null}
                  videoOn={videoEnabled} audioOn={audioEnabled} isLocal handRaised={handRaised}
                  inSpotlight={inSpotlight}
                  onClick={() => {
                    if (pickerForSlot >= 0) { assignToSlot(pickerForSlot, localUserId); }
                  }}
                  picking={pickerForSlot >= 0}
                />
              );
            })()}

            {/* Remote peers */}
            {Array.from(peers.values()).map(peer => {
              const inSpotlight = spotlightSlots.includes(peer.userId);
              return (
                <ThumbnailCell
                  key={peer.userId}
                  stream={peer.stream} nickname={peer.nickname}
                  profileImage={peer.profileImage}
                  videoOn={peer.videoEnabled} audioOn={peer.audioEnabled} isLocal={false}
                  handRaised={peer.handRaised} inSpotlight={inSpotlight}
                  onClick={() => {
                    if (pickerForSlot >= 0) { assignToSlot(pickerForSlot, peer.userId); }
                  }}
                  picking={pickerForSlot >= 0}
                />
              );
            })}

            {/* Empty placeholders */}
            {Array.from({ length: Math.max(0, 12 - activeParticipants.length) }).map((_, i) => (
              <div key={`e-${i}`} style={{
                aspectRatio: '4/3', borderRadius: 6, background: '#0c0c18',
                border: '1px dashed rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div style={{
          width: 280, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: '#0a0a12',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '8px 12px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#c9a96e' }}>채팅</span>
            {chatUnread > 0 && (
              <span style={{
                minWidth: 16, height: 16, borderRadius: 8,
                background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
              }}>{chatUnread > 99 ? '99+' : chatUnread}</span>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <VideoChatPanel
              meetingId={mid}
              currentUserId={user?.id || 0}
              onClose={() => {}}
              unreadCount={chatUnread}
              onResetUnread={() => setChatUnread(0)}
              password={password}
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

      {/* Click-away: close picker */}
      {pickerForSlot >= 0 && (
        <div
          onClick={() => setPickerForSlot(-1)}
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
        />
      )}
    </div>
  );
}

/* ── Right-sidebar thumbnail cell ── */
function ThumbnailCell({
  stream, nickname, profileImage, videoOn, audioOn, isLocal, handRaised,
  inSpotlight, onClick, picking,
}: {
  stream: MediaStream | null; nickname: string; profileImage: string | null;
  videoOn: boolean; audioOn: boolean; isLocal: boolean; handRaised: boolean;
  inSpotlight: boolean; onClick: () => void; picking: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (vidRef.current && stream) vidRef.current.srcObject = stream; }, [stream]);

  return (
    <div
      onClick={picking ? onClick : undefined}
      style={{
        aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden',
        position: 'relative', background: '#0c0c18',
        border: inSpotlight
          ? '2px solid rgba(201,169,110,0.4)'
          : handRaised
          ? '2px solid rgba(201,169,110,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        cursor: picking ? 'pointer' : 'default',
        opacity: picking && !inSpotlight ? 1 : picking && inSpotlight ? 0.5 : 1,
        transition: 'border 0.15s, opacity 0.15s',
      }}
    >
      {stream && videoOn ? (
        <video ref={vidRef} autoPlay playsInline muted={isLocal} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: isLocal ? 'scaleX(-1)' : 'none',
        }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#c9a96e',
          }}>{nickname.charAt(0)}</div>
        </div>
      )}
      {/* Overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3px 5px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        <span style={{ fontSize: 9, color: '#d0d0da', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {nickname}{isLocal ? ' (나)' : ''}
        </span>
        {!audioOn && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
            <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12" />
          </svg>
        )}
      </div>
      {inSpotlight && (
        <div style={{
          position: 'absolute', top: 2, left: 2, fontSize: 8, padding: '1px 4px',
          background: 'rgba(201,169,110,0.3)', borderRadius: 3, color: '#c9a96e', fontWeight: 700,
        }}>LIVE</div>
      )}
      {handRaised && (
        <div style={{ position: 'absolute', top: 2, right: 2, fontSize: 10 }}>&#9995;</div>
      )}
      {picking && !inSpotlight && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(201,169,110,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#c9a96e', fontWeight: 600 }}>클릭하여 배치</span>
        </div>
      )}
    </div>
  );
}
