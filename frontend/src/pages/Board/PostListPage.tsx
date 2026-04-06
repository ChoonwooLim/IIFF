import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import PostCard from "@/components/board/PostCard";

interface Post {
  id: number;
  board_id: number;
  title: string;
  youtube_url: string | null;
  is_pinned: boolean;
  view_count: number;
  comment_count: number;
  file_count: number;
  user: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

export default function PostListPage() {
  const { boardSlug } = useParams<{ boardSlug: string }>();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [boardName, setBoardName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchPosts = async (p: number = 1, s: string = "") => {
    const params = new URLSearchParams({ page: String(p), per_page: "20" });
    if (s) params.set("search", s);
    const { data } = await api.get(`/boards/${boardSlug}/posts?${params}`);
    setPosts(data.items);
    setTotalPages(data.pages);
    setPage(data.page);
  };

  useEffect(() => {
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: { slug: string; name: string }) => b.slug === boardSlug);
      if (board) setBoardName(board.name);
    });
    fetchPosts();
  }, [boardSlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1, search);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-display text-3xl text-gold">{boardName}</h1>
        {user && (
          <Link to={`/boards/${boardSlug}/write`}
            className="px-4 py-2 bg-[var(--color-gold)] text-black font-semibold rounded-lg">
            글쓰기
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색..."
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
        <button type="submit" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">검색</button>
      </form>

      <div className="space-y-2">
        {posts.map((post) => (
          <PostCard key={post.id} id={post.id} boardSlug={boardSlug!}
            title={post.title} user={post.user} viewCount={post.view_count}
            commentCount={post.comment_count} fileCount={post.file_count}
            isPinned={post.is_pinned} createdAt={post.created_at} />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-12">게시글이 없습니다.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchPosts(p, search)}
              className={`px-3 py-1 rounded ${p === page ? "bg-[var(--color-gold)] text-black" : "bg-white/5 text-gray-400"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
