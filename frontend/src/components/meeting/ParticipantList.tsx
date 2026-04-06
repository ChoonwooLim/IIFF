interface Participant {
  id: number;
  nickname: string;
  profile_image: string | null;
}

export default function ParticipantList({ participants, onClose }: { participants: Participant[]; onClose?: () => void }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d0d14',
    }}>
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>
          참여자 <span style={{ color: '#c9a96e', fontWeight: 400 }}>{participants.length}</span>
        </h4>
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#5a5a6a', fontSize: 18, cursor: 'pointer',
          }}>&times;</button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {participants.map((p) => (
          <div key={p.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(201,169,110,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {p.profile_image ? (
                <img src={p.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 13, color: '#c9a96e' }}>{p.nickname.charAt(0)}</span>
              )}
            </div>
            <span style={{ fontSize: 14, color: '#c0c0ca' }}>{p.nickname}</span>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ade80', marginLeft: 'auto', flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
