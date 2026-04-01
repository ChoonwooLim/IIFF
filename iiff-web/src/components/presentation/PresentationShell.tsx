'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { slides } from '@/lib/slides';
import Slide from './Slide';
import SlideNav from './SlideNav';

export default function PresentationShell() {
  const router = useRouter();
  const [[currentIndex, direction], setSlide] = useState([0, 0]);

  const goNext = useCallback(() => {
    setSlide(([prev]) => {
      if (prev >= slides.length - 1) return [prev, 0];
      return [prev + 1, 1];
    });
  }, []);

  const goPrev = useCallback(() => {
    setSlide(([prev]) => {
      if (prev <= 0) return [prev, 0];
      return [prev - 1, -1];
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          e.preventDefault();
          router.push('/');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, router]);

  return (
    <div className="fixed inset-0 bg-[var(--bg)] overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <Slide
          key={slides[currentIndex].id}
          slide={slides[currentIndex]}
          direction={direction}
        />
      </AnimatePresence>

      <SlideNav
        current={currentIndex}
        total={slides.length}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
