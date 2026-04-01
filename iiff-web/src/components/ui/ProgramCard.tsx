'use client';

import Image from 'next/image';

interface ProgramCardProps {
  num: string;
  title: string;
  desc: string;
  points?: string[];
  imageSrc?: string;
}

export default function ProgramCard({ num, title, desc, points, imageSrc }: ProgramCardProps) {
  return (
    <div className="group relative rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] hover:border-[var(--border-gold)] transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-alt)]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/30 to-transparent" />

        {/* Number overlay */}
        <span className="absolute top-4 left-4 label-upper text-gold/80 text-xs">{num}</span>
      </div>

      {/* Content */}
      <div className="p-6 bg-[var(--bg-card)]" style={{ backdropFilter: `blur(var(--glass-blur))` }}>
        <h3 className="heading-section text-lg text-[var(--text)] mb-3 group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-4">{desc}</p>

        {points && points.length > 0 && (
          <ul className="space-y-1.5">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                <span className="text-gold mt-0.5 shrink-0">&#9656;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
