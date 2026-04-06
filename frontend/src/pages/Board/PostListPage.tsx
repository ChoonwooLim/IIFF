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
  thumbnail_id: number | null;
  user: { id: number; nickname: string; profile_image: string | null };
  created_at: string;
}

function ImageCard({ post, boardSlug, index }: { post: Post; boardSlug: string; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/boards/${boardSlug}/posts/${post.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4 / 3',
        background: '#0a0a14',
        textDecoration: 'none',
        animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.06}s both`,
      }}
    >
      {/* Thumbnail image */}
      {post.thumbnail_id ? (
        <img
          src={`/api/files/${post.thumbnail_id}/download`}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            filter: hovered ? 'brightness(0.7)' : 'brightness(0.85)',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a14, #14141f)',
          color: '#2a2a3a',
          fontSize: '2rem',
        }}>
          🖼️
        </div>
      )}

      {/* Gold accent line on hover */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: '#c9a96e',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      }} />

      {/* Overlay with title */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '40px 16px 14px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        opacity: hovered ? 1 : 0.85,
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#f0f0f5',
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 4,
        }}>
          {post.title}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.6875rem',
          color: '#8a8a9a',
        }}>
          <span>{post.user.nickname}</span>
          <span style={{ color: '#c9a96e' }}>
            {post.file_count > 0 && `${post.file_count}장`}
          </span>
        </div>
      </div>

      {/* Pinned badge */}
      {post.is_pinned && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          background: 'rgba(201,169,110,0.9)',
          color: '#05050a',
          fontWeight: 600,
        }}>
          고정
        </div>
      )}
    </Link>
  );
}

export default function PostListPage() {
  const { boardSlug } = useParams<{ boardSlug: string }>();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [boardName, setBoardName] = useState("");
  const [boardType, setBoardType] = useState("");
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
      const board = data.find((b: { slug: string; name: string; board_type: string }) => b.slug === boardSlug);
      if (board) {
        setBoardName(board.name);
        setBoardType(board.board_type);
      }
    });
    fetchPosts();
  }, [boardSlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1, search);
  };

  const isImageBoard = boardType === "image";

  return (
    <div style={{ maxWidth: isImageBoard ? 960 : 720, margin: '0 auto', padding: '0 24px' }}>
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
              fontSize: '0.6875rem',
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
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.2,
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
              fontSize: '0.75rem',
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
              fontSize: '0.875rem',
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
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          검색
        </button>
      </form>

      {/* Post list — image grid or editorial list */}
      {isImageBoard ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 4,
          paddingBottom: 64,
        }}>
          {posts.map((post, i) => (
            <ImageCard key={post.id} post={post} boardSlug={boardSlug!} index={i} />
          ))}
        </div>
      ) : (
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
        </div>
      )}

      {posts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: '#3a3a4a',
        }}>
          <p style={{ fontSize: '0.875rem', marginBottom: 8 }}>게시글이 없습니다</p>
          {user && (
            <p style={{ fontSize: '0.8125rem', color: '#5a5a6a' }}>
              위의 <span style={{ color: '#c9a96e' }}>글쓰기</span> 버튼으로 시작하세요
            </p>
          )}
        </div>
      )}

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
                fontSize: '0.8125rem',
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
