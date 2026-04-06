import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

interface Board {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  board_type: string;
}

const BOARD_ICONS: Record<string, string> = {
  notice: "📢", suggestion: "💡", image: "🖼️",
  video: "🎬", archive: "📁", qna: "❓",
};

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.get("/boards").then(({ data }) => setBoards(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-display text-3xl text-gold mb-8">게시판</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map((board) => (
          <Link key={board.id} to={`/boards/${board.slug}`}
            className="glass-card p-6 hover:border-[var(--color-gold)]/30 transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{BOARD_ICONS[board.slug] || "📋"}</span>
              <h2 className="text-xl text-white font-semibold">{board.name}</h2>
            </div>
            {board.description && <p className="text-sm text-gray-400">{board.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
