import { useState, useEffect } from "react";
import api from "@/services/api";

interface PostItem {
  id: number;
  title: string;
  board_name: string;
  author_nickname: string;
  is_hidden: boolean;
  view_count: number;
  created_at: string;
}

export default function PostModerationPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hiddenOnly, setHiddenOnly] = useState(false);

  const fetchPosts = () => {
    api.get("/admin/posts", { params: { page, per_page: 20, hidden_only: hiddenOnly } })
      .then(({ data }) => { setPosts(data.posts); setTotal(data.total); });
  };

  useEffect(() => { fetchPosts(); }, [page, hiddenOnly]);

  const toggleHide = async (postId: number) => {
    await api.patch(`/admin/posts/${postId}/hide`);
    fetchPosts();
  };

  const deletePost = async (postId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/admin/posts/${postId}`);
    fetchPosts();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="heading-display text-2xl text-gold mb-6">게시글 관리</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => { setHiddenOnly(false); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm ${!hiddenOnly ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
          전체
        </button>
        <button onClick={() => { setHiddenOnly(true); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-sm ${hiddenOnly ? "bg-[var(--color-gold)] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
          숨김만
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-white/10">
              <th className="py-3 px-2">제목</th>
              <th className="py-3 px-2">게시판</th>
              <th className="py-3 px-2">작성자</th>
              <th className="py-3 px-2">조회</th>
              <th className="py-3 px-2">상태</th>
              <th className="py-3 px-2">작성일</th>
              <th className="py-3 px-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-2 text-white max-w-[200px] truncate">{p.title}</td>
                <td className="py-3 px-2 text-gray-400">{p.board_name}</td>
                <td className="py-3 px-2 text-gray-400">{p.author_nickname}</td>
                <td className="py-3 px-2 text-gray-500">{p.view_count}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.is_hidden ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                    {p.is_hidden ? "숨김" : "공개"}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString("ko-KR") : ""}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    <button onClick={() => toggleHide(p.id)}
                      className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30">
                      {p.is_hidden ? "공개" : "숨김"}
                    </button>
                    <button onClick={() => deletePost(p.id)}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm ${p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
