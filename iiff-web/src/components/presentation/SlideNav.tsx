'use client';

import Link from 'next/link';

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
      {/* Progress bar at very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-[var(--border)]">
        <div
          className="h-full bg-[var(--color-gold)] transition-all duration-500 ease-[var(--ease-expo)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nav bar */}
      <div className="fixed bottom-1 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
        {/* Left: Exit */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span className="hidden sm:inline">Exit</span>
        </Link>

        {/* Center: Counter + Arrows */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={current === 0}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="text-[var(--text-dim)] text-sm font-mono tabular-nums min-w-[60px] text-center">
            {current + 1} / {total}
          </span>

          <button
            onClick={onNext}
            disabled={current === total - 1}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Right: Fullscreen */}
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Toggle fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
    </>
  );
}
