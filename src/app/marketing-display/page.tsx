'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING DISPLAY – edit this list to change what plays on the TV
// Add images (jpg/png/webp) or videos (mp4) from the /public folder
// Each entry can have a custom duration in milliseconds (default: 8000)
// ─────────────────────────────────────────────────────────────────────────────
const MEDIA_PLAYLIST: { src: string; type: 'image' | 'video'; durationMs?: number }[] = [
  { src: '/menu-board-bg.mp4', type: 'video' },
  { src: '/hero-video.mp4',    type: 'video' },
  { src: '/assets/fundraising-flyer.png', type: 'image', durationMs: 10000 },
  { src: '/assets/cobblestone-sms-optin.png', type: 'image', durationMs: 10000 },
  { src: '/logo.png',          type: 'image', durationMs: 8000 },
];

const DEFAULT_IMAGE_DURATION_MS = 8000;

export default function MarketingDisplay() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = MEDIA_PLAYLIST[index];

  const goNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((i) => (i + 1) % MEDIA_PLAYLIST.length);
      setFade(true);
    }, 600);
  };

  // For images, advance after durationMs
  useEffect(() => {
    if (current.type === 'image') {
      timerRef.current = setTimeout(goNext, current.durationMs ?? DEFAULT_IMAGE_DURATION_MS);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // For videos, play and advance when ended
  useEffect(() => {
    if (current.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [index, current.type]);

  const handleVideoEnded = () => goNext();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      {/* Media layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'opacity 0.6s ease',
          opacity: fade ? 1 : 0,
        }}
      >
        {current.type === 'video' ? (
          <video
            key={current.src}
            ref={videoRef}
            src={current.src}
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.src}
            src={current.src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      {/* Subtle branding watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 32,
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{ height: 48 }} />
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {MEDIA_PLAYLIST.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === index ? '#C8956C' : 'rgba(255,255,255,0.35)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
