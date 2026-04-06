import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  label: string;
  labelClassName?: string;
}

/**
 * A self-contained animated stat card with a GSAP scroll-triggered counter.
 */
export default function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  decimals = 0,
  className = '',
  label,
  labelClassName = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ val: 0 });

  useGSAP(() => {
    if (!numRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      numRef.current.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
      return;
    }

    gsap.to(counterRef.current, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
      },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix}${counterRef.current.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={`text-center p-8 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)] ${className}`}>
      <p className="font-heading text-4xl md:text-5xl font-bold text-gold mb-3">
        <span ref={numRef}>{prefix}0{suffix}</span>
      </p>
      <p className={`label-upper text-[var(--text-muted)] ${labelClassName}`}>{label}</p>
    </div>
  );
}
