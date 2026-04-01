'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';

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
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' },
        0
      );
    }

    // Label slides up
    if (labelRef.current) {
      tl.fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
        0.2
      );
    }

    // Title slides up
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
        0.35
      );
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-[var(--bg)]"
    >
      {/* Large background number */}
      <span
        ref={numRef}
        className="absolute text-[20vw] md:text-[15vw] font-heading font-bold text-[var(--border)] select-none pointer-events-none leading-none"
        style={{ opacity: 0 }}
      >
        {String(part).padStart(2, '0')}
      </span>

      <div className="relative z-10 text-center">
        <p ref={labelRef} className="label-upper text-gold mb-4" style={{ opacity: 0 }}>
          Part {part}
        </p>
        <h2 ref={titleRef} className="heading-display text-4xl md:text-6xl text-[var(--text)]" style={{ opacity: 0 }}>
          {title}
        </h2>
      </div>
    </div>
  );
}
