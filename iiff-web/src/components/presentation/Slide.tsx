'use client';

import { motion } from 'framer-motion';
import type { SlideData } from '@/lib/slides';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

interface SlideProps {
  slide: SlideData;
  direction: number;
}

export default function Slide({ slide, direction }: SlideProps) {
  if (slide.type === 'cover') {
    return (
      <motion.div
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]"
      >
        {slide.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-[var(--bg)]/60" />
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          <p className="label-upper text-[var(--color-gold)] mb-6">
            Incheon International Film Festival
          </p>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-[var(--text)] mb-8">
            <span className="text-[var(--color-gold)]">
              {slide.id === 'closing' ? 'Thank You' : 'NextWave'}
            </span>
            <br />
            {slide.id === 'closing' ? '' : '2026'}
          </h1>
          <div className="space-y-3">
            {slide.content.map((line, i) => (
              <p
                key={i}
                className="text-body text-[var(--text-dim)] text-lg md:text-xl"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (slide.type === 'part-divider') {
    return (
      <motion.div
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]"
      >
        {slide.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-[var(--bg)]/70" />
        <div className="relative z-10 text-center px-8">
          <p className="label-upper text-[var(--color-gold)] mb-4 tracking-[0.2em]">
            Part {slide.part}
          </p>
          <div className="w-16 h-[2px] bg-[var(--color-gold)] mx-auto mb-8" />
          <h2 className="heading-display text-5xl md:text-7xl text-[var(--text)]">
            {slide.partTitle}
          </h2>
        </div>
      </motion.div>
    );
  }

  // content, table, stats
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center bg-[var(--bg)]"
    >
      {slide.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      )}
      <div className="absolute inset-0 bg-[var(--bg)]/80" />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-16 py-16">
        {/* Part label */}
        {slide.part > 0 && (
          <p className="label-upper text-[var(--color-gold)] mb-3">
            Part {slide.part} — {slide.partTitle}
          </p>
        )}

        {/* Title */}
        <h2 className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-10">
          {slide.title}
        </h2>

        {/* Gold accent line */}
        <div className="w-12 h-[2px] bg-[var(--color-gold)] mb-10" />

        {/* Bullets */}
        <ul className="space-y-5">
          {slide.content.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-4 text-body text-[var(--text-dim)] text-base md:text-lg leading-relaxed"
            >
              <span className="mt-2 block h-2 w-2 shrink-0 rounded-full bg-[var(--color-gold)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
