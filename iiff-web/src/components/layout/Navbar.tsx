'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  {
    label: '소개',
    href: '#intro',
    children: [
      { label: 'IIFF란?', href: '#what-is-iiff' },
      { label: '페스티벌 개요', href: '#overview' },
      { label: '왜 참여하나?', href: '#why-participate' },
      { label: '왜 인천인가?', href: '#why-incheon' },
      { label: '비전 & 철학', href: '#vision' },
    ],
  },
  {
    label: '프로그램',
    href: '#programs',
    children: [
      { label: '핵심 프로그램', href: '#core-programs' },
      { label: '스타 초청 & 캠프', href: '#star-camp' },
      { label: '데일리 시뮬레이션', href: '#daily-simulation' },
      { label: '시민 참여', href: '#civic-participation' },
    ],
  },
  {
    label: '전략',
    href: '#strategy',
    children: [
      { label: '핵심 전략', href: '#core-strategy' },
      { label: '조직', href: '#organization' },
      { label: '로드맵', href: '#roadmap' },
      { label: '공간 & 파트너', href: '#space-partners' },
    ],
  },
  {
    label: '재무',
    href: '#finance',
    children: [
      { label: '예산 계획', href: '#budget' },
      { label: '스폰서십', href: '#sponsorship' },
      { label: '마케팅', href: '#marketing' },
    ],
  },
  {
    label: '거버넌스',
    href: '#governance',
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-[var(--content-wide)] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logos/iiff-white.png"
            alt="IIFF Logo"
            width={40}
            height={40}
            className="dark:block hidden"
          />
          <Image
            src="/images/logos/iiff-dark.png"
            alt="IIFF Logo"
            width={40}
            height={40}
            className="dark:hidden block"
          />
          <span className="label-upper text-gold hidden sm:block">NextWave 2026</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={item.href}
                className="px-4 py-5 text-sm font-light tracking-wide text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-300"
              >
                {item.label}
              </a>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                  <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-2 shadow-[var(--shadow-elevated)]"
                       style={{ backdropFilter: `blur(var(--glass-blur))` }}>
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-[var(--text-dim)] hover:text-gold hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[var(--bg)]/95 backdrop-blur-xl z-40 overflow-y-auto">
          <div className="flex flex-col p-8 gap-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-heading text-[var(--text)] block mb-3"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="flex flex-col gap-2 pl-4 border-l border-[var(--border-gold)]">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-[var(--text-dim)] hover:text-gold transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
