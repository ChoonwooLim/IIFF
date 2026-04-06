interface FileInfo {
  id: number;
  original_name: string;
  file_size: number;
  mime_type: string;
}

export default function FileList({ files }: { files: FileInfo[] }) {
  if (files.length === 0) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
      <h4 className="text-sm text-gray-400 mb-2">첨부파일 ({files.length})</h4>
      <ul className="space-y-1">
        {files.map((file) => (
          <li key={file.id} className="flex items-center gap-2 text-sm">
            <a href={`/api/files/${file.id}/download`}
              className="text-[var(--color-gold)] hover:underline truncate">
              {file.original_name}
            </a>
            <span className="text-gray-600">({formatSize(file.file_size)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
