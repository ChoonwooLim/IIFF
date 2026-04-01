'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  num?: string;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  num,
}: GlassCardProps) {
  return (
    <div
      className={`
        relative p-8 rounded-[var(--radius-card)]
        bg-[var(--bg-card)] border border-[var(--border)]
        ${hover ? 'hover:border-[var(--border-gold)] hover:-translate-y-1 cursor-pointer' : ''}
        transition-all duration-500 overflow-hidden
        ${className}
      `}
      style={{ backdropFilter: `blur(var(--glass-blur))` }}
      role="article"
      tabIndex={hover ? 0 : undefined}
    >
      {num && (
        <span className="absolute top-6 right-6 font-heading text-5xl font-bold text-[var(--border)] group-hover:text-gold/20 transition-colors duration-500 select-none">
          {num}
        </span>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
