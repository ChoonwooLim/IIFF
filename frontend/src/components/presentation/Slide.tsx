import { motion } from 'framer-motion';
import type { SlideData } from '@/lib/slides';

/* -- Shared easing -- */
const ease = [0.16, 1, 0.3, 1] as const;

/* -- Slide-level transition -- */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-30%' : '30%',
    opacity: 0,
    scale: 0.95,
  }),
};

const slideTransition = { duration: 0.7, ease };

/* -- Staggered content children -- */
const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const fadeScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
};

const lineExpand = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.8, ease, delay: 0.3 } },
};

interface SlideProps {
  slide: SlideData;
  direction: number;
}

export default function Slide({ slide, direction }: SlideProps) {
  /* -- Cover slides -- */
  if (slide.type === 'cover') {
    return (
      <motion.div
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]"
      >
        {/* Background image */}
        {slide.image && (
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease }}
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/60 to-[var(--bg)]/90" />

        {/* Decorative ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.2 }}
          className="absolute w-[600px] h-[600px] rounded-full border border-[var(--color-gold)]"
        />

        <motion.div
          className="relative z-10 text-center px-8 max-w-5xl mx-auto"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.p variants={fadeUp} className="label-upper text-[var(--color-gold)] mb-6 tracking-[0.25em]">
            Incheon International Film Festival
          </motion.p>
          <motion.h1 variants={fadeScale} className="heading-display text-5xl md:text-7xl lg:text-8xl text-[var(--text)] mb-4">
            <span className="text-[var(--color-gold)]">
              {slide.id === 'closing' ? 'Thank You' : 'NextWave'}
            </span>
            <br />
            {slide.id === 'closing' ? '' : '2026'}
          </motion.h1>
          <motion.div variants={lineExpand} className="w-24 h-[1px] bg-[var(--color-gold)] mx-auto mb-8 origin-center" />

          {/* Video Player */}
          {slide.video && (
            <motion.div
              variants={fadeUp}
              className="relative w-full max-w-3xl mx-auto mb-8 aspect-video rounded-[var(--radius-card)] overflow-hidden border border-[var(--border-gold)] shadow-[0_0_40px_rgba(201,169,110,0.15)]"
            >
              <iframe
                src={`https://www.youtube.com/embed/${slide.video}?rel=0&modestbranding=1&playsinline=1`}
                title="IIFF Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </motion.div>
          )}

          <div className="space-y-2">
            {slide.content.map((line, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-body text-[var(--text-dim)] text-lg md:text-xl"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* -- Part Dividers -- */
  if (slide.type === 'part-divider') {
    return (
      <motion.div
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]"
      >
        {slide.image && (
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease }}
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, transparent, rgba(5,5,10,0.6) 50%, rgba(5,5,10,0.9))' }} />

        <motion.div
          className="relative z-10 text-center px-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.p variants={fadeUp} className="label-upper text-[var(--color-gold)] mb-4 tracking-[0.3em] text-sm">
            Part {slide.part}
          </motion.p>
          <motion.div variants={lineExpand} className="w-20 h-[2px] bg-[var(--color-gold)] mx-auto mb-8 origin-center" />
          <motion.h2
            variants={fadeScale}
            className="heading-display text-5xl md:text-7xl text-[var(--text)]"
          >
            {slide.partTitle}
          </motion.h2>
          {/* Subtle decorative dots */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mt-10">
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/40"
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  /* -- Content / Table / Stats -- */
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="absolute inset-0 flex items-center bg-[var(--bg)]"
    >
      {slide.image && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-[var(--bg)]/70" />

      {/* Decorative side accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.15 }}
        className="absolute left-8 md:left-16 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-gold)]/20 to-transparent origin-top"
      />

      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-12 md:px-20 py-16"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Part label */}
        {slide.part > 0 && (
          <motion.p variants={fadeUp} className="label-upper text-[var(--color-gold)] mb-3 tracking-[0.15em]">
            Part {slide.part} — {slide.partTitle}
          </motion.p>
        )}

        {/* Title */}
        <motion.h2 variants={fadeUp} className="heading-section text-3xl md:text-5xl text-[var(--text)] mb-10">
          {slide.title}
        </motion.h2>

        {/* Gold accent line */}
        <motion.div variants={lineExpand} className="w-12 h-[2px] bg-[var(--color-gold)] mb-10 origin-left" />

        {/* Bullets */}
        <ul className="space-y-5">
          {slide.content.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.08 }}
              className="flex items-start gap-4 text-body text-[var(--text-dim)] text-base md:text-lg leading-relaxed group"
            >
              <span className="mt-2 block h-2 w-2 shrink-0 rounded-full bg-[var(--color-gold)]/60 group-hover:bg-[var(--color-gold)] transition-colors duration-300" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
