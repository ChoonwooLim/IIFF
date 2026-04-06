import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface Phase {
  label: string;
  title: string;
  period?: string;
  items: string[];
}

interface TimelineRoadmapProps {
  phases: Phase[];
  className?: string;
}

export default function TimelineRoadmap({ phases, className = '' }: TimelineRoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate the vertical line growing
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.5,
        ease: 'power2.out',
        transformOrigin: 'top',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate each phase card
    const cards = containerRef.current.querySelectorAll('[data-timeline-card]');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      );
    });

    // Animate dots
    const dots = containerRef.current.querySelectorAll('[data-timeline-dot]');
    dots.forEach((dot, i) => {
      gsap.fromTo(
        dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          delay: i * 0.15,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Vertical line */}
      <div
        ref={lineRef}
        className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent"
        style={{ transformOrigin: 'top', transform: 'scaleY(0)' }}
      />

      <div className="flex flex-col gap-12">
        {phases.map((phase, idx) => (
          <div key={idx} className="relative pl-12 md:pl-16" data-timeline-card style={{ opacity: 0 }}>
            {/* Dot */}
            <div
              data-timeline-dot
              className="absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full bg-gold border-2 border-[var(--bg)] z-10"
              style={{ transform: 'scale(0)' }}
            />

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-card)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="label-upper text-gold text-[0.65rem]">{phase.label}</span>
                {phase.period && (
                  <span className="text-xs text-[var(--text-muted)]">{phase.period}</span>
                )}
              </div>
              <h4 className="heading-section text-lg md:text-xl text-[var(--text)] mb-4">
                {phase.title}
              </h4>
              <ul className="space-y-2">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-dim)]">
                    <span className="text-gold mt-1 shrink-0">&#9656;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
