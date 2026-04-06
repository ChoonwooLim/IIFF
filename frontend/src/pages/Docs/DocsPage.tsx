import { Link } from 'react-router-dom';

const DOC = {
  title: 'IIFF Final Plan',
  file: '/docs/IIFF_Final_Plan.pdf',
};

export default function DocsPage() {
  return (
    <div className="h-screen flex flex-col bg-[var(--bg)]">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-[var(--border)] bg-[var(--bg-elevated)] shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-[var(--text-dim)] hover:text-gold transition-colors text-sm flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            홈으로
          </Link>
          <span className="text-[var(--border)] hidden sm:inline">|</span>
          <span className="label-upper text-gold text-[0.65rem] hidden sm:inline">IIFF Documents</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={DOC.file}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-dim)] hover:text-gold border border-[var(--border)] hover:border-gold/40 rounded-[var(--radius-sm)] transition-all duration-200"
            title="다운로드"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">다운로드</span>
          </a>
          <button
            onClick={() => {
              const iframe = document.querySelector('iframe');
              if (iframe?.contentWindow) {
                iframe.contentWindow.print();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-dim)] hover:text-gold border border-[var(--border)] hover:border-gold/40 rounded-[var(--radius-sm)] transition-all duration-200"
            title="인쇄"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span className="hidden sm:inline">인쇄</span>
          </button>
        </div>
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        <iframe
          src={DOC.file}
          className="absolute inset-0 w-full h-full border-0"
          title={DOC.title}
        />
      </div>
    </div>
  );
}
