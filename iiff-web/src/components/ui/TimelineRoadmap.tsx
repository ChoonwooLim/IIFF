'use client';

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
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent" />

      <div className="flex flex-col gap-12">
        {phases.map((phase, idx) => (
          <div key={idx} className="relative pl-12 md:pl-16">
            {/* Dot */}
            <div className="absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full bg-gold border-2 border-[var(--bg)] z-10" />

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
