import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import FileList from "@/components/board/FileList";
import ImageGallery from "@/components/board/ImageGallery";
import CommentSection from "@/components/board/CommentSection";

interface PostDetail {
  id: number;
  board_id: number;
  title: string;
  content: string;
  youtube_url: string | null;
  is_pinned: boolean;
  view_count: number;
  user: { id: number; nickname: string; profile_image: string | null };
  files: { id: number; original_name: string; file_size: number; mime_type: string }[];
  created_at: string;
  updated_at: string;
}

export default function PostDetailPage() {
  const { boardSlug, postId } = useParams<{ boardSlug: string; postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [boardType, setBoardType] = useState("general");
  const [boardName, setBoardName] = useState("");
  const [deleteHovered, setDeleteHovered] = useState(false);

  useEffect(() => {
    api.get(`/posts/${postId}`).then(({ data }) => setPost(data));
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: { slug: string; board_type: string; name: string }) => b.slug === boardSlug);
      if (board) {
        setBoardType(board.board_type);
        setBoardName(board.name);
      }
    });
  }, [postId, boardSlug]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/posts/${postId}`);
    navigate(`/boards/${boardSlug}`);
  };

  if (!post) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#5a5a6a',
      fontSize: 14,
    }}>
      로딩 중...
    </div>
  );

  const isAuthor = user?.id === post.user.id;
  const isAdmin = user && ["admin", "superadmin"].includes(user.role);
  const imageFiles = post.files.filter((f) => f.mime_type.startsWith("image/"));
  const otherFiles = post.files.filter((f) => !f.mime_type.startsWith("image/"));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 32 }}>
        <Link
          to={`/boards/${boardSlug}`}
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            textDecoration: 'none',
            display: 'block',
            marginBottom: 24,
          }}
        >
          ← {boardName || 'Back'}
        </Link>

        <article>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.3,
            marginBottom: 24,
          }}>
            {post.title}
          </h1>

          {/* Post meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 12,
            color: '#5a5a6a',
            paddingBottom: 24,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span>{post.user.nickname}</span>
            <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
            <span>조회 {post.view_count}</span>
            {(isAuthor || isAdmin) && (
              <button
                onClick={handleDelete}
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: deleteHovered ? '#f87171' : '#6a4a4a',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
              >
                삭제
              </button>
            )}
          </div>

          {/* YouTube embed */}
          {post.youtube_url && (
            <div style={{ margin: '32px 0', aspectRatio: '16 / 9' }}>
              <iframe
                src={post.youtube_url.replace("watch?v=", "embed/")}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          <div style={{
            color: '#b0b0ba',
            whiteSpace: 'pre-wrap',
            fontSize: 15,
            lineHeight: 1.8,
            padding: '32px 0',
          }}>
            {post.content}
          </div>

          {/* Files */}
          {imageFiles.length > 0 && <ImageGallery files={imageFiles} />}
          {otherFiles.length > 0 && <FileList files={otherFiles} />}
        </article>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 32,
        }}>
          <CommentSection postId={post.id} postUserId={post.user.id} boardType={boardType} />
        </div>
      </div>
    </div>
  );
}
