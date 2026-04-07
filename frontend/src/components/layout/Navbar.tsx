import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
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
    href: '#part-programs',
    children: [
      { label: '핵심 프로그램', href: '#programs' },
      { label: '스타 초청 & 캠프', href: '#stars' },
      { label: '데일리 시뮬레이션', href: '#simulation' },
      { label: '시민 참여', href: '#volunteer' },
    ],
  },
  {
    label: '전략',
    href: '#part-strategy',
    children: [
      { label: '핵심 전략', href: '#strategy' },
      { label: '조직', href: '#organization' },
      { label: '로드맵', href: '#roadmap' },
      { label: '공간 & 파트너', href: '#space' },
      { label: 'BIFF 비교', href: '#biff' },
    ],
  },
  {
    label: '재무',
    href: '#part-finance',
    children: [
      { label: '예산 계획', href: '#budget' },
      { label: '현금 흐름', href: '#cashflow' },
      { label: '초기 예산', href: '#seedmoney' },
      { label: '스폰서십', href: '#sponsorship' },
      { label: '마케팅', href: '#marketing' },
    ],
  },
  {
    label: '거버넌스',
    href: '#part-governance',
    children: [
      { label: '리스크 관리', href: '#political' },
      { label: '인력', href: '#personnel' },
    ],
  },
];

const COMMUNITY_LINKS = [
  { label: '게시판', to: '/boards' },
  { label: '회의실', to: '/meetings' },
];

/* ── Twinverse-inspired gradient colors ── */
const GRADIENT_HOVER = 'linear-gradient(135deg, #c9a96e 0%, #e0c992 30%, #f5d9a0 50%, #c9a96e 70%, #a07c3f 100%)';
const GLOW_GOLD = 'rgba(201,169,110,0.45)';
const GLOW_WARM = 'rgba(224,201,146,0.3)';

function NavLink({
  href,
  onClick,
  active,
  index,
  children,
}: {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  active: boolean;
  index: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="menuitem"
      style={{
        padding: '8px 16px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: isActive ? 700 : 600,
        letterSpacing: '0.02em',
        color: isActive ? '#0a0a14' : '#ffffff',
        background: isActive
          ? GRADIENT_HOVER
          : 'linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15))',
        backgroundSize: 'cover',
        border: `1px solid ${isActive ? '#c9a96e' : 'rgba(255,255,255,0.25)'}`,
        textShadow: isActive
          ? '0 1px 4px rgba(0,0,0,0.2)'
          : '0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)',
        boxShadow: isActive
          ? `0 8px 32px ${GLOW_GOLD}, 0 4px 16px ${GLOW_WARM}, 0 0 48px rgba(201,169,110,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`
          : 'none',
        transform: isActive ? 'translateY(-2px) scale(1.04)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        textDecoration: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        /* Staggered entrance */
        animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${0.15 + index * 0.06}s both`,
      }}
    >
      {children}
    </a>
  );
}

function DropdownItem({
  href,
  onClick,
  index,
  children,
}: {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  index: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="menuitem"
      style={{
        display: 'block',
        padding: '10px 20px',
        borderRadius: 10,
        margin: '3px 8px',
        fontSize: 14,
        fontWeight: hovered ? 600 : 400,
        color: hovered ? '#0a0a14' : '#c0c0d0',
        background: hovered
          ? GRADIENT_HOVER
          : 'linear-gradient(135deg, rgba(10,10,20,0.5), rgba(30,30,60,0.3), rgba(201,169,110,0.04), rgba(15,15,30,0.5))',
        border: `1px solid ${hovered ? '#c9a96e' : 'rgba(201,169,110,0.08)'}`,
        backdropFilter: 'blur(8px)',
        textShadow: hovered
          ? '0 1px 4px rgba(0,0,0,0.2)'
          : '0 2px 6px rgba(10,10,20,0.5)',
        boxShadow: hovered
          ? `0 6px 24px ${GLOW_GOLD}, 0 3px 12px ${GLOW_WARM}, inset 0 1px 0 rgba(255,255,255,0.15)`
          : 'none',
        transform: hovered ? 'translateX(8px) scale(1.01)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        textDecoration: 'none',
        cursor: 'pointer',
        /* Staggered cascade entrance */
        animation: `dropItemIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.05}s both`,
      }}
    >
      {children}
    </a>
  );
}

function CommunityLink({
  to,
  active,
  delayIndex,
  children,
}: {
  to: string;
  active: boolean;
  delayIndex: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 14px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        letterSpacing: '0.02em',
        color: isActive ? '#0a0a14' : 'rgba(255,255,255,0.7)',
        background: isActive
          ? GRADIENT_HOVER
          : 'transparent',
        border: `1px solid ${isActive ? '#c9a96e' : 'transparent'}`,
        boxShadow: isActive
          ? `0 6px 24px ${GLOW_GOLD}, inset 0 1px 0 rgba(255,255,255,0.15)`
          : 'none',
        transform: isActive ? 'translateY(-2px) scale(1.04)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        textDecoration: 'none',
        textShadow: isActive ? 'none' : '0 2px 6px rgba(0,0,0,0.6)',
        /* Staggered entrance after nav items */
        animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${0.5 + delayIndex * 0.06}s both`,
      }}
    >
      {children}
    </Link>
  );
}

function IconButton({
  to,
  title,
  gold,
  delayIndex,
  children,
}: {
  to: string;
  title: string;
  gold?: boolean;
  delayIndex: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: hovered
          ? (gold ? '#0a0a14' : '#c9a96e')
          : (gold ? '#c9a96e' : 'rgba(255,255,255,0.6)'),
        background: hovered
          ? (gold ? GRADIENT_HOVER : 'rgba(255,255,255,0.08)')
          : 'transparent',
        border: `1px solid ${
          hovered
            ? (gold ? '#c9a96e' : 'rgba(255,255,255,0.2)')
            : (gold ? 'rgba(201,169,110,0.35)' : 'rgba(255,255,255,0.12)')
        }`,
        boxShadow: hovered && gold
          ? `0 4px 16px ${GLOW_GOLD}`
          : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        /* Staggered entrance */
        animation: `fadeUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${0.6 + delayIndex * 0.06}s both`,
      }}
    >
      {children}
    </Link>
  );
}

function AudioMuteButton() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('audio-muted') === 'true';
  });

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem('audio-muted', String(next));
      // Mute/unmute all video and audio elements on the page
      document.querySelectorAll('video, audio').forEach((el) => {
        (el as HTMLMediaElement).muted = next;
      });
      return next;
    });
  }, []);

  // Apply mute state to new media elements
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (muted) {
        document.querySelectorAll('video, audio').forEach((el) => {
          (el as HTMLMediaElement).muted = true;
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Apply immediately
    document.querySelectorAll('video, audio').forEach((el) => {
      (el as HTMLMediaElement).muted = muted;
    });
    return () => observer.disconnect();
  }, [muted]);

  return (
    <button
      onClick={toggle}
      className="relative w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--border-gold)] transition-colors duration-300"
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={muted ? '음소거 해제' : '음소거'}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = ['subadmin', 'admin', 'superadmin'].includes(user?.role || '');

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
      setActiveDropdown(null);
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundImage: `linear-gradient(135deg, rgba(5,5,14,0.5), rgba(10,10,25,0.35), rgba(5,5,14,0.5)), url('/images/hero/cinema.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.15)'}`,
        boxShadow: scrolled
          ? `0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
        transition: 'box-shadow 0.6s cubic-bezier(0.25, 1, 0.5, 1), border-bottom 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        /* Navbar entrance animation */
        animation: 'navSlideDown 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      {/* Scroll-activated border glow */}
      {scrolled && (
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), rgba(224,201,146,0.5), rgba(201,169,110,0.4), transparent)',
            animation: 'borderGlow 3s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="h-14 md:h-[72px]"
        style={{
          maxWidth: 1920,
          margin: '0 auto',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            flexShrink: 0,
            transform: logoHovered ? 'scale(1.06)' : 'none',
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            /* Logo entrance */
            animation: 'fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.05s both',
          }}
        >
          <img
            src="/images/logos/iiff-white.png"
            alt="IIFF Logo"
            width={44}
            height={44}
            style={{
              filter: logoHovered
                ? 'drop-shadow(0 2px 12px rgba(201,169,110,0.5)) drop-shadow(0 0 20px rgba(201,169,110,0.3))'
                : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              transition: 'filter 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: '#c9a96e',
              transition: 'filter 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              filter: logoHovered
                ? 'drop-shadow(0 2px 12px rgba(201,169,110,0.5))'
                : 'none',
            }}
          >
            NextWave 2026
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div
          role="menubar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 32,
            flexWrap: 'wrap',
          }}
          className="hidden lg:flex"
        >
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <NavLink
                href={item.href}
                onClick={handleAnchorClick}
                active={activeDropdown === item.label}
                index={i}
              >
                {item.label}
              </NavLink>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    paddingTop: 10,
                    minWidth: 250,
                  }}
                >
                  <div
                    role="menu"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(10,10,20,0.85), rgba(20,20,40,0.8), rgba(10,10,20,0.85)), url('/images/hero/cinema.webp')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(201,169,110,0.2)',
                      borderRadius: 16,
                      padding: '10px 0',
                      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
                      animation: 'dropIn 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                      /* Subtle glow pulse on the dropdown container */
                      overflow: 'hidden',
                    }}
                  >
                    {item.children.map((child, ci) => (
                      <DropdownItem
                        key={child.href}
                        href={child.href}
                        onClick={handleAnchorClick}
                        index={ci}
                      >
                        {child.label}
                      </DropdownItem>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 24,
              background: 'rgba(255,255,255,0.15)',
              margin: '0 8px',
              animation: 'fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.45s both',
            }}
          />

          {/* Community links */}
          {COMMUNITY_LINKS.map((link, i) => (
            <CommunityLink
              key={link.to}
              to={link.to}
              active={location.pathname.startsWith(link.to)}
              delayIndex={i}
            >
              {link.label}
            </CommunityLink>
          ))}
          {isAdmin && (
            <CommunityLink
              to="/admin"
              active={location.pathname.startsWith('/admin')}
              delayIndex={COMMUNITY_LINKS.length}
            >
              관리자
            </CommunityLink>
          )}
        </div>

        {/* ── Right Controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden sm:flex">
          <IconButton to="/docs" title="기획서 PDF 보기" delayIndex={0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="hidden md:inline">PDF</span>
          </IconButton>

          <IconButton to="/presentation" title="프레젠테이션 모드" gold delayIndex={1}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            <span className="hidden md:inline">Present</span>
          </IconButton>

          {user ? (
            <>
              <IconButton to="/boards" title={user.nickname || user.name} delayIndex={2}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden md:inline">{user.nickname || user.name}</span>
              </IconButton>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                title="로그아웃"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  animation: `fadeUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.72s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#dc5050';
                  e.currentTarget.style.borderColor = 'rgba(220,80,80,0.3)';
                  e.currentTarget.style.background = 'rgba(220,80,80,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <IconButton to="/login" title="로그인" gold delayIndex={2}>
              로그인
            </IconButton>
          )}

          {/* Audio Mute Toggle */}
          <AudioMuteButton />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div style={{ width: 22, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span
              style={{
                display: 'block',
                height: 2,
                borderRadius: 1,
                background: '#fff',
                transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                height: 2,
                borderRadius: 1,
                background: '#fff',
                transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-label="Navigation menu"
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            top: 56,
            zIndex: 40,
            backgroundImage: `linear-gradient(180deg, rgba(5,5,14,0.95), rgba(10,10,25,0.98))`,
            backdropFilter: 'blur(20px)',
            overflowY: 'auto',
            padding: '16px 16px',
          }}
        >
          {/* Nav sections — staggered entrance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  animation: `mobileSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${i * 0.06}s both`,
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  style={{
                    display: 'block',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#f0f0f5',
                    textDecoration: 'none',
                    marginBottom: 10,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      paddingLeft: 16,
                      borderLeft: '2px solid rgba(201,169,110,0.3)',
                    }}
                  >
                    {item.children.map((child, ci) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={(e) => handleAnchorClick(e, child.href)}
                        style={{
                          fontSize: 14,
                          color: '#8a8a9a',
                          textDecoration: 'none',
                          padding: '4px 0',
                          animation: `mobileSlideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) ${i * 0.06 + 0.1 + ci * 0.03}s both`,
                        }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Community links */}
            <div
              style={{
                paddingTop: 24,
                marginTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                animation: `mobileSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${NAV_ITEMS.length * 0.06 + 0.1}s both`,
              }}
            >
              {COMMUNITY_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: location.pathname.startsWith(link.to) ? '#c9a96e' : '#f0f0f5',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: location.pathname.startsWith('/admin') ? '#c9a96e' : '#f0f0f5',
                    textDecoration: 'none',
                  }}
                >
                  관리자
                </Link>
              )}
            </div>

            {/* Auth */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                animation: `mobileSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${NAV_ITEMS.length * 0.06 + 0.2}s both`,
              }}
            >
              {user ? (
                <>
                  <span style={{ fontSize: 14, color: '#8a8a9a' }}>
                    {user.nickname || user.name} 님
                  </span>
                  <button
                    onClick={async () => { setMobileOpen(false); await logout(); navigate('/'); }}
                    style={{
                      fontSize: 16,
                      color: '#dc5050',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 18,
                    color: '#c9a96e',
                    textDecoration: 'none',
                  }}
                >
                  로그인
                </Link>
              )}
            </div>

            {/* PDF & Presentation */}
            <div
              style={{
                paddingTop: 24,
                marginTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                animation: `mobileSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${NAV_ITEMS.length * 0.06 + 0.3}s both`,
              }}
            >
              <Link
                to="/docs"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 16,
                  color: '#8a8a9a',
                  textDecoration: 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                기획서 PDF
              </Link>
              <Link
                to="/presentation"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 16,
                  color: '#c9a96e',
                  textDecoration: 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                프레젠테이션
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
