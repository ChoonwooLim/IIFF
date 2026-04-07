import { type PeerState } from '@/hooks/useWebRTC';
import VideoTile from './VideoTile';

interface VideoGridProps {
  localStream: MediaStream | null;
  localNickname: string;
  localProfileImage: string | null;
  localVideoEnabled: boolean;
  localAudioEnabled: boolean;
  screenSharing: boolean;
  peers: Map<number, PeerState>;
}

function getGridStyle(count: number): React.CSSProperties {
  let cols = 1;
  if (count === 2) cols = 2;
  else if (count <= 4) cols = 2;
  else if (count <= 9) cols = 3;
  else cols = 4;

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 8,
    width: '100%',
    height: '100%',
    padding: 8,
  };
}

export default function VideoGrid({
  localStream,
  localNickname,
  localProfileImage,
  localVideoEnabled,
  localAudioEnabled,
  screenSharing,
  peers,
}: VideoGridProps) {
  const peerList = Array.from(peers.values());
  const totalCount = 1 + peerList.length; // local + remote

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
        />
      ))}
    </div>
  );
}
