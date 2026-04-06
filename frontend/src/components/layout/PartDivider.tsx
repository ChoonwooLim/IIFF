import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface PartDividerProps {
  part: number;
  title: string;
}

export default function PartDivider({ part, title }: PartDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });

    // Background number scales up and fades in
    if (numRef.current) {
      tl.fromTo(
        numRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 0.06, duration: 1.4, ease: 'expo.out' },
        0
      );
    }

    // Gold line expands
    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'expo.out' },
        0.2
      );
    }

    // Label slides up
    if (labelRef.current) {
      tl.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
        0.3
      );
    }

    // Title slides up
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
        0.45
      );
    }
  }, { scope: containerRef });

  const num = String(part).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '96px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#05050a',
      }}
    >
      {/* Large background number — very subtle, behind everything */}
      <span
        ref={numRef}
        style={{
          position: 'absolute',
          fontSize: 'clamp(10rem, 20vw, 22rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: '#ffffff',
          opacity: 0,
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {num}
      </span>

      {/* Foreground content — always readable */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Gold line */}
        <div
          ref={lineRef}
          style={{
            width: 48,
            height: 1,
            background: '#c9a96e',
            margin: '0 auto 20px',
            transformOrigin: 'center',
            transform: 'scaleX(0)',
          }}
        />

        <p
          ref={labelRef}
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            marginBottom: 12,
            opacity: 0,
          }}
        >
          Part {part}
        </p>

        <h2
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            opacity: 0,
            textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
