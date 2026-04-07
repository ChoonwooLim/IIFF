import { type PeerState } from '@/hooks/useWebRTC';
import VideoTile from './VideoTile';

interface VideoGridProps {
  localStream: MediaStream | null;
  localNickname: string;
  localProfileImage: string | null;
  localVideoEnabled: boolean;
  localAudioEnabled: boolean;
  localHandRaised: boolean;
  screenSharing: boolean;
  peers: Map<number, PeerState>;
}

function getGridStyle(count: number): React.CSSProperties {
  let cols = 1;
  if (count === 2) cols = 2;
  else if (count <= 4) cols = 2;
  else if (count <= 9) cols = 3;
  else cols = 4;

  const rows = Math.ceil(count / cols);

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: 6,
    position: 'absolute' as const,
    inset: 0,
  };
}

export default function VideoGrid({
  localStream,
  localNickname,
  localProfileImage,
  localVideoEnabled,
  localAudioEnabled,
  localHandRaised,
  screenSharing,
  peers,
}: VideoGridProps) {
  const peerList = Array.from(peers.values());
  const totalCount = 1 + peerList.length;

  return (
    <div style={getGridStyle(totalCount)}>
      {/* Local video */}
      <VideoTile
        stream={localStream}
        nickname={localNickname}
        profileImage={localProfileImage}
        videoEnabled={localVideoEnabled}
        audioEnabled={localAudioEnabled}
        isLocal
        isScreenShare={screenSharing}
        handRaised={localHandRaised}
      />

      {/* Remote peers */}
      {peerList.map((peer) => (
        <VideoTile
          key={peer.userId}
          stream={peer.stream}
          nickname={peer.nickname}
          profileImage={peer.profileImage}
          videoEnabled={peer.videoEnabled}
          audioEnabled={peer.audioEnabled}
          handRaised={peer.handRaised}
        />
      ))}
    </div>
  );
}
