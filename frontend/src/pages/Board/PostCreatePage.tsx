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
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);
  const [youtubeFocused, setYoutubeFocused] = useState(false);

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

  const labelStyle = (focused: boolean) => ({
    display: 'block' as const,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: focused ? '#c9a96e' : '#5a5a6a',
    marginBottom: 4,
    transition: 'color 0.3s ease',
  });

  const inputStyle = (focused: boolean) => ({
    width: '100%',
    padding: '14px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused ? '#c9a96e' : 'rgba(255,255,255,0.12)'}`,
    color: '#f0f0f5',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{
        paddingTop: 120,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c9a96e',
          marginBottom: 12,
        }}>
          {boardName}
        </p>
        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 40,
          fontWeight: 700,
          color: '#f0f0f5',
        }}>
          글쓰기
        </h1>
      </div>

      {error && (
        <div style={{
          marginTop: 24,
          padding: '14px 20px',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Title field */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle(titleFocused)}>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            required
            maxLength={200}
            style={inputStyle(titleFocused)}
          />
        </div>

        {/* YouTube URL field */}
        {boardType === "video" && (
          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle(youtubeFocused)}>YouTube URL</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onFocus={() => setYoutubeFocused(true)}
              onBlur={() => setYoutubeFocused(false)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              style={inputStyle(youtubeFocused)}
            />
          </div>
        )}

        {/* Content field */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle(contentFocused)}>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setContentFocused(true)}
            onBlur={() => setContentFocused(false)}
            rows={12}
            required
            style={{
              ...inputStyle(contentFocused),
              borderBottom: 'none',
              border: `1px solid ${contentFocused ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.08)'}`,
              padding: '16px',
              resize: 'vertical' as const,
              lineHeight: 1.7,
            }}
          />
        </div>

        {/* File uploader */}
        <div style={{ marginBottom: 40 }}>
          <FileUploader files={files} onChange={setFiles} />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '14px 40px',
            background: isLoading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
            color: '#05050a',
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {isLoading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
