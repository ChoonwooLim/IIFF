interface Participant {
  id: number;
  nickname: string;
  profile_image: string | null;
}

export default function ParticipantList({ participants }: { participants: Participant[] }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
      <h4 className="text-sm text-gray-400 mb-3">참여자 ({participants.length})</h4>
      <ul className="space-y-2">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm text-gray-300">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {p.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
}
