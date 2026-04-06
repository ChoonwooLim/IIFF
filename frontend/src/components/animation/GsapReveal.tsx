import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface GsapRevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
}

export default function GsapReveal({
  children,
  className = '',
  y = 30,
  duration = 1,
  delay = 0,
  start = 'top 85%',
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start,
        },
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
