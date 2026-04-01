'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface GoldShimmerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function GoldShimmer({
  children,
  className = '',
  as: Tag = 'h2',
}: GoldShimmerProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      ref.current,
      {
        backgroundPosition: '-200% center',
      },
      {
        backgroundPosition: '200% center',
        duration: 4,
        ease: 'none',
        repeat: -1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          toggleActions: 'play pause resume pause',
        },
      }
    );
  }, { scope: ref });

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`bg-clip-text text-transparent bg-[length:200%_100%] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--color-gold-dark) 0%, var(--color-gold-light) 25%, var(--color-gold) 50%, var(--color-gold-light) 75%, var(--color-gold-dark) 100%)',
      }}
    >
      {children}
    </Tag>
  );
}
