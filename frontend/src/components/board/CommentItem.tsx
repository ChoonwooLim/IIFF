import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";

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
  comment: Comment;
  postUserId: number;
  boardType: string;
  onReply: (parentId: number, content: string) => Promise<void>;
  onAdopt: (commentId: number) => Promise<void>;
  depth?: number;
}

export default function CommentItem({ comment, postUserId, boardType, onReply, onAdopt, depth = 0 }: Props) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReply(false);
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-white/10 pl-4" : ""}`}>
      <div className={`py-3 ${comment.is_adopted ? "bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg p-3" : ""}`}>
        {comment.is_adopted && (
          <span className="text-xs px-2 py-0.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded mb-2 inline-block">
            채택된 답변
          </span>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span className="text-white">{comment.user.nickname}</span>
          <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
        </div>
        <p className="text-gray-300 text-sm">{comment.content}</p>
        <div className="flex gap-3 mt-2">
          {user && depth < 2 && (
            <button onClick={() => setShowReply(!showReply)} className="text-xs text-gray-500 hover:text-gray-300">
              답글
            </button>
          )}
          {boardType === "qna" && user?.id === postUserId && !comment.is_adopted && !comment.parent_id && (
            <button onClick={() => onAdopt(comment.id)} className="text-xs text-[var(--color-gold)] hover:underline">
              채택
            </button>
          )}
        </div>
      </div>

      {showReply && (
        <div className="ml-8 mt-2 flex gap-2">
          <input value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white" />
          <button onClick={handleReply}
            className="px-3 py-2 bg-[var(--color-gold)] text-black text-sm rounded-lg">등록</button>
        </div>
      )}

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postUserId={postUserId}
          boardType={boardType} onReply={onReply} onAdopt={onAdopt} depth={depth + 1} />
      ))}
    </div>
  );
}
