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
  const [searchFocused, setSearchFocused] = useState(false);

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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Page header */}
      <div style={{
        paddingTop: 120,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <Link
            to="/boards"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#c9a96e',
              marginBottom: 12,
              display: 'block',
              textDecoration: 'none',
            }}
          >
            ← Boards
          </Link>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 40,
            fontWeight: 700,
            color: '#f0f0f5',
          }}>
            {boardName}
          </h1>
        </div>
        {user && (
          <Link
            to={`/boards/${boardSlug}/write`}
            style={{
              padding: '10px 20px',
              background: '#c9a96e',
              color: '#05050a',
              border: '1px solid #c9a96e',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            글쓰기
          </Link>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{
        padding: '24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="검색..."
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${searchFocused ? '#c9a96e' : 'rgba(255,255,255,0.12)'}`,
              color: '#f0f0f5',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#6a6a7a',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          검색
        </button>
      </form>

      {/* Post list */}
      <div style={{ paddingBottom: 64 }}>
        {posts.map((post, i) => (
          <div key={post.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
            <PostCard
              id={post.id} boardSlug={boardSlug!}
              title={post.title} user={post.user} viewCount={post.view_count}
              commentCount={post.comment_count} fileCount={post.file_count}
              isPinned={post.is_pinned} createdAt={post.created_at}
            />
          </div>
        ))}
        {posts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#3a3a4a',
          }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>게시글이 없습니다</p>
            {user && (
              <p style={{ fontSize: 13, color: '#5a5a6a' }}>
                위의 <span style={{ color: '#c9a96e' }}>글쓰기</span> 버튼으로 시작하세요
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          paddingBottom: 64,
        }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchPosts(p, search)}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: p === page ? '#c9a96e' : 'transparent',
                color: p === page ? '#05050a' : '#5a5a6a',
                border: p === page ? 'none' : '1px solid rgba(255,255,255,0.08)',
                fontSize: 13,
                fontWeight: p === page ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
