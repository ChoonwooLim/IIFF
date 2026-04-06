interface ImageFile {
  id: number;
  original_name: string;
  mime_type: string;
}

export default function ImageGallery({ files }: { files: ImageFile[] }) {
  const images = files.filter((f) => f.mime_type.startsWith("image/"));
  if (images.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((img) => (
        <a key={img.id} href={`/api/files/${img.id}/download`} target="_blank" rel="noopener noreferrer">
          <img src={`/api/files/${img.id}/download`} alt={img.original_name}
            className="w-full h-48 object-cover rounded-lg border border-white/10" />
        </a>
      ))}
    </div>
  );
}
