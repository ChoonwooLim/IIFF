import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[var(--bg-alt)] border-t border-[var(--border)] py-16 px-6 md:px-10">
      <div className="max-w-[var(--content-wide)] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <Image
              src="/images/logos/iiff-white.png"
              alt="IIFF"
              width={32}
              height={32}
              className="opacity-70 dark:block hidden"
            />
            <Image
              src="/images/logos/iiff-dark.png"
              alt="IIFF"
              width={32}
              height={32}
              className="opacity-70 dark:hidden block"
            />
            <div className="border-l border-[var(--border)] pl-4">
              <span className="label-upper text-gold-muted">NextWave 2026</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
            <a href="#" className="hover:text-gold transition-colors duration-300">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">YouTube</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">LinkedIn</a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>&copy; 2026 Incheon International Film Festival. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
