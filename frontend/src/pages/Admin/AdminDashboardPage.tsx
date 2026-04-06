import { useState, useEffect } from "react";
import api from "@/services/api";

interface Stats {
  total_users: number;
  pending_users: number;
  active_users: number;
  total_posts: number;
  hidden_posts: number;
  active_meetings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="text-gray-400 py-12 text-center">로딩 중...</div>;

  const cards = [
    { label: "전체 회원", value: stats.total_users, color: "text-white" },
    { label: "승인 대기", value: stats.pending_users, color: "text-yellow-400" },
    { label: "활성 회원", value: stats.active_users, color: "text-green-400" },
    { label: "전체 게시글", value: stats.total_posts, color: "text-white" },
    { label: "숨김 게시글", value: stats.hidden_posts, color: "text-red-400" },
    { label: "활성 회의실", value: stats.active_meetings, color: "text-blue-400" },
  ];

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-8">대시보드</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
