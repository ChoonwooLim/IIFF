'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface SlideNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function SlideNav({ current, total, onPrev, onNext }: SlideNavProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <>
      {/* ── Home button (top-left, always visible) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-5 left-5 z-50"
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--color-gold)] hover:border-[var(--border-gold)] transition-all duration-300 group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform duration-300"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-xs tracking-wide">홈으로</span>
        </Link>
      </motion.div>

      {/* ── Slide counter (top-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="fixed top-5 right-5 z-50 flex items-center gap-3"
      >
        <span className="text-[var(--text-muted)] text-xs font-mono tabular-nums">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-colors"
          aria-label="Toggle fullscreen"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </motion.div>

      {/* ── Progress bar (bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-[3px] bg-[var(--border)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* ── Prev / Next arrows (sides) ── */}
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="fixed left-3 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full text-[var(--text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--bg-card)] disabled:opacity-0 disabled:pointer-events-none transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={onNext}
        disabled={current === total - 1}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full text-[var(--text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--bg-card)] disabled:opacity-0 disabled:pointer-events-none transition-all duration-300"
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  );
}
