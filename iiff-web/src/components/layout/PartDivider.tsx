'use client';

interface PartDividerProps {
  part: number;
  title: string;
}

export default function PartDivider({ part, title }: PartDividerProps) {
  return (
    <div className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-[var(--bg)]">
      {/* Large background number */}
      <span className="absolute text-[20vw] md:text-[15vw] font-heading font-bold text-[var(--border)] select-none pointer-events-none leading-none">
        {String(part).padStart(2, '0')}
      </span>

      <div className="relative z-10 text-center">
        <p className="label-upper text-gold mb-4">Part {part}</p>
        <h2 className="heading-display text-4xl md:text-6xl text-[var(--text)]">
          {title}
        </h2>
      </div>
    </div>
  );
}
