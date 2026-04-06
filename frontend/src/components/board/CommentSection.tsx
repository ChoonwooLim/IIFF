import { useState, useEffect } from "react";
import api from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";
import CommentItem from "./CommentItem";

interface Comment {
  id: number;
  post_id: number;
  user: { id: number; nickname: string; profile_image: string | null };
  parent_id: number | null;
  content: string;
  is_adopted: boolean;
  created_at: string;
  replies: Comment[];
}

interface Props {
  postId: number;
  postUserId: number;
  boardType: string;
}

export default function CommentSection({ postId, postUserId, boardType }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const { data } = await api.get(`/posts/${postId}/comments`);
    setComments(data);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await api.post(`/posts/${postId}/comments`, { content: newComment });
    setNewComment("");
    fetchComments();
  };

  const handleReply = async (parentId: number, content: string) => {
    await api.post(`/posts/${postId}/comments`, { content, parent_id: parentId });
    fetchComments();
  };

  const handleAdopt = async (commentId: number) => {
    await api.post(`/comments/${commentId}/adopt`);
    fetchComments();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg text-white mb-4">댓글 ({comments.length})</h3>

      {user && (
        <div className="flex gap-2 mb-6">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
          <button onClick={handleSubmit}
            className="px-6 py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg">등록</button>
        </div>
      )}

      <div className="space-y-1">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} postUserId={postUserId}
            boardType={boardType} onReply={handleReply} onAdopt={handleAdopt} />
        ))}
      </div>
    </div>
  );
}
