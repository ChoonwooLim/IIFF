import { useRef, useEffect } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  nickname: string;
  profileImage: string | null;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal?: boolean;
  isScreenShare?: boolean;
}

export default function VideoTile({
  stream,
  nickname,
  profileImage,
  videoEnabled,
  audioEnabled,
  isLocal = false,
  isScreenShare = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initial = nickname?.charAt(0)?.toUpperCase() || '?';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#0a0a14',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal && !isScreenShare ? 'scaleX(-1)' : 'none',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {profileImage ? (
            <img
              src={profileImage}
              alt={nickname}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(201,169,110,0.15)',
              border: '2px solid rgba(201,169,110,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: '#c9a96e',
            }}>
              {initial}
            </div>
          )}
        </div>
      )}

      {/* Name overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 12px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: '#f0f0f5', fontWeight: 500 }}>
          {nickname}{isLocal ? ' (나)' : ''}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {!audioEnabled && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
              <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
              <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
          {!videoEnabled && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16.88 3.549L7.12 20.451" />
              <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
