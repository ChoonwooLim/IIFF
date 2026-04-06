import { useState } from "react";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#c9a96e' : '#5a5a6a',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#08080e',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '64px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          {/* Logo + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src="/images/logos/iiff-white.png"
              alt="IIFF"
              width={28}
              height={28}
              style={{ opacity: 0.6 }}
              loading="lazy"
            />
            <div style={{
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              paddingLeft: 16,
            }}>
              <span style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.5)',
              }}>
                NextWave 2026
              </span>
            </div>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 24, fontSize: '0.8125rem' }}>
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">YouTube</FooterLink>
            <FooterLink href="#">LinkedIn</FooterLink>
          </div>
        </div>

        <div style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: '0.6875rem',
          color: '#3a3a4a',
        }}>
          <p>&copy; 2026 Incheon International Film Festival. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
