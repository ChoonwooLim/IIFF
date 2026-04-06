import { useRef } from "react";

interface FileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function FileUploader({ files, onChange, maxFiles = 10 }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    onChange(combined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input ref={inputRef} type="file" multiple onChange={handleAdd}
        className="hidden" id="file-upload" />
      <label htmlFor="file-upload"
        className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 cursor-pointer hover:bg-white/10 transition">
        파일 첨부 ({files.length}/{maxFiles})
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <span className="truncate">{file.name}</span>
              <span className="text-gray-600">({(file.size / 1024).toFixed(0)} KB)</span>
              <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-300">x</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
