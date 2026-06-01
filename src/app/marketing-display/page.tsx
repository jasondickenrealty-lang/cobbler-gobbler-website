'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING DISPLAY
// Falls back to local /public files so it always works even before anything
// is uploaded. Any files uploaded to the "marketing-display/" Firebase Storage
// folder are appended to the end of the playlist automatically.
// Refreshes every 60 seconds — new uploads appear without touching the TV.
// ─────────────────────────────────────────────────────────────────────────────

interface MediaItem {
  src: string;
  type: 'image' | 'video';
  durationMs?: number;
}

const LOCAL_PLAYLIST: MediaItem[] = [
  { src: '/assets/fundraising-flyer.png',    type: 'image', durationMs: 10000 },
  { src: '/assets/cobblestone-sms-optin.png',type: 'image', durationMs: 10000 },
  { src: '/logo.png',                        type: 'image', durationMs: 8000 },
];

const DEFAULT_IMAGE_MS = 8000;

function getType(url: string): 'image' | 'video' {
  return /\.(mp4|webm|mov)/i.test(url) ? 'video' : 'image';
}

export default function MarketingDisplay() {
  const [playlist, setPlaylist] = useState<MediaItem[]>(LOCAL_PLAYLIST);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch uploaded files from Firebase Storage.
  // If uploads exist, use them as the active playlist.
  // Otherwise fall back to local bundled assets.
  const fetchUploads = async () => {
    try {
      const res = await fetch('/api/marketing-display-media');
      if (!res.ok) {
        setPlaylist(LOCAL_PLAYLIST);
        setIndex(0);
        return;
      }
      const data = await res.json();
      const uploads: MediaItem[] = (data.media ?? []).map((m: { url: string }) => ({
        src: m.url,
        type: getType(m.url),
        durationMs: DEFAULT_IMAGE_MS,
      }));

      if (uploads.length > 0) {
        setPlaylist(uploads);
      } else {
        setPlaylist(LOCAL_PLAYLIST);
      }
      setIndex(0);
    } catch {
      // Network error — keep using local playlist, don't crash
      setPlaylist(LOCAL_PLAYLIST);
      setIndex(0);
    }
  };

  useEffect(() => {
    fetchUploads();
    const interval = setInterval(fetchUploads, 60_000);
    return () => clearInterval(interval);
  }, []);

  const current = playlist[index];

  const goNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex(i => (i + 1) % playlist.length);
      setFade(true);
    }, 600);
  };

  // Image timer
  useEffect(() => {
    if (!current || current.type !== 'image') return;
    timerRef.current = setTimeout(goNext, current.durationMs ?? DEFAULT_IMAGE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playlist.length]);

  // Video autoplay
  useEffect(() => {
    if (!current || current.type !== 'video') return;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [index, current]);

  if (!current) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden', cursor: 'none' }}>

      {/* Media layer */}
      <div style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: fade ? 1 : 0 }}>
        {current.type === 'video' ? (
          <video
            key={current.src}
            ref={videoRef}
            src={current.src}
            muted
            playsInline
            onEnded={goNext}
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

      {/* Branding watermark */}
      <div style={{ position: 'absolute', bottom: 24, right: 32, opacity: 0.35, pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{ height: 48 }} />
      </div>

      {/* Progress dots */}
      {playlist.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, pointerEvents: 'none',
        }}>
          {playlist.map((_, i) => (
            <div key={i} style={{
              width: i === index ? 24 : 8, height: 8, borderRadius: 4,
              background: i === index ? '#C8956C' : 'rgba(255,255,255,0.35)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
