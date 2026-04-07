'use client';

import { useRef, useEffect } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().then(() => {
      video.muted = false;
    }).catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      src="/iiff-part2.mp4"
      controls
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover border-0"
    />
  );
}
