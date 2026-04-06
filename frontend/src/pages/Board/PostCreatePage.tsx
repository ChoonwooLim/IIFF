import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import FileUploader from "@/components/board/FileUploader";

export default function PostCreatePage() {
  const { boardSlug } = useParams<{ boardSlug: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [boardId, setBoardId] = useState<number | null>(null);
  const [boardType, setBoardType] = useState("");
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get("/boards").then(({ data }) => {
      const board = data.find((b: { slug: string; id: number; board_type: string; name: string }) => b.slug === boardSlug);
      if (board) {
        setBoardId(board.id);
        setBoardType(board.board_type);
        setBoardName(board.name);
      }
    });
  }, [boardSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId) return;
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("board_id", String(boardId));
    formData.append("title", title);
    formData.append("content", content);
    if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
    files.forEach((f) => formData.append("files", f));

    try {
      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/boards/${boardSlug}/posts/${data.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || "게시글 작성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-display text-2xl text-gold mb-8">{boardName} — 글쓰기</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
            required maxLength={200} />
        </div>

        {boardType === "video" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">YouTube URL</label>
            <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none"
              required />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">내용</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-gold)] focus:outline-none resize-y"
            required />
        </div>

        <FileUploader files={files} onChange={setFiles} />

        <button type="submit" disabled={isLoading}
          className="w-full py-3 bg-[var(--color-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-gold-light)] transition disabled:opacity-50">
          {isLoading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
