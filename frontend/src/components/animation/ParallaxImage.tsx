import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface ParallaxImageProps {
  src: string;
  alt?: string;
  speed?: number;
  className?: string;
  overlay?: boolean;
  priority?: boolean;
  /** true = position:absolute inset:0 (fills parent), false = position:relative (self-sized) */
  fill?: boolean;
}

export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.2,
  className = '',
  overlay = true,
  fill = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const distance = speed * 100;

    gsap.fromTo(
      imageRef.current,
      { yPercent: -distance },
      {
        yPercent: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ position: fill ? 'absolute' : 'relative', ...(fill ? { inset: 0 } : {}) }}
    >
      <div ref={imageRef} className="absolute inset-[-20%] will-change-transform">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      )}
    </div>
  );
}
