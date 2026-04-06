import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface GsapCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function GsapCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: GsapCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ val: 0 });

  useGSAP(() => {
    if (!ref.current) return;

    gsap.to(counterRef.current, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(counterRef.current.val)}${suffix}`;
        }
      },
    });
  }, { scope: ref });

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
