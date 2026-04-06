import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    api.get(`/posts/${postId}`).then(({ data }) => setPost(data));
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: { slug: string; board_type: string }) => b.slug === boardSlug);
      if (board) setBoardType(board.board_type);
    });
  }, [postId, boardSlug]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/posts/${postId}`);
    navigate(`/boards/${boardSlug}`);
  };

  if (!post) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>;

  const isAuthor = user?.id === post.user.id;
  const isAdmin = user && ["admin", "superadmin"].includes(user.role);
  const imageFiles = post.files.filter((f) => f.mime_type.startsWith("image/"));
  const otherFiles = post.files.filter((f) => !f.mime_type.startsWith("image/"));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article>
        <h1 className="text-2xl text-white font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-white/10">
          <span>{post.user.nickname}</span>
          <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
          <span>조회 {post.view_count}</span>
          {(isAuthor || isAdmin) && (
            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 ml-auto">삭제</button>
          )}
        </div>

        {post.youtube_url && (
          <div className="mb-6 aspect-video">
            <iframe src={post.youtube_url.replace("watch?v=", "embed/")}
              className="w-full h-full rounded-lg" allowFullScreen />
          </div>
        )}

        <div className="text-gray-300 whitespace-pre-wrap mb-6">{post.content}</div>

        {imageFiles.length > 0 && <ImageGallery files={imageFiles} />}
        {otherFiles.length > 0 && <FileList files={otherFiles} />}
      </article>

      <CommentSection postId={post.id} postUserId={post.user.id} boardType={boardType} />
    </div>
  );
}
