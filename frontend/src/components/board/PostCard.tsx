import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  boardSlug: string;
  title: string;
  user: { nickname: string };
  viewCount: number;
  commentCount: number;
  fileCount: number;
  isPinned: boolean;
  createdAt: string;
}

export default function PostCard({
  id, boardSlug, title, user, viewCount, commentCount, fileCount, isPinned, createdAt,
}: PostCardProps) {
  return (
    <Link to={`/boards/${boardSlug}/posts/${id}`}
      className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
      <div className="flex items-center gap-2 mb-1">
        {isPinned && (
          <span className="text-xs px-2 py-0.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded">고정</span>
        )}
        <h3 className="text-white font-medium truncate">{title}</h3>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{user.nickname}</span>
        <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
        <span>조회 {viewCount}</span>
        {commentCount > 0 && <span>댓글 {commentCount}</span>}
        {fileCount > 0 && <span>파일 {fileCount}</span>}
      </div>
    </Link>
  );
}
