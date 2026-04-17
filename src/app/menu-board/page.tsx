'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SLIDE_DURATION_MS = 10000;

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
  displayOrder?: number;
  categoryOrder?: number;
}
interface ModifierCategory { id: string; name: string; displayOrder?: number; }
interface Modifier { id: string; name: string; price: number; modifierCategoryId: string; isActive?: boolean; }
type Slide = { type: 'category'; category: string; items: MenuItem[] } | { type: 'toppings'; modCats: ModifierCategory[]; modifiers: Modifier[] };

// Right-side video / image / branded placeholder panel
function VideoPanel({ videoUrl, sideImageUrl }: { videoUrl: string | null; sideImageUrl?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { ref.current?.play().catch(() => {}); }, [videoUrl]);
  if (sideImageUrl) {
    return (
      <aside style={{ width: '38%', flexShrink: 0, background: '#0a0a0a', borderLeft: '3px solid #1a1a1a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sideImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </aside>
    );
  }
  return (
    <aside style={{ width: '38%', flexShrink: 0, background: '#0a0a0a', borderLeft: '3px solid #1a1a1a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {videoUrl
        ? <video ref={ref} src={videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        : (
          <div style={{ textAlign: 'center', padding: '2rem', userSelect: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" style={{ width: 200, maxWidth: '80%', opacity: 0.85, marginBottom: '1.5rem' }} />
            <div style={{ width: 40, height: 2, background: '#C8956C', opacity: 0.6, margin: '0 auto 1rem', borderRadius: 1 }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0, letterSpacing: '0.06em' }}>900 Main Street &bull; Evansville, IN</p>
          </div>
        )}
    </aside>
  );
}

// Left-side menu list for a single category
function CategorySlide({ category, items, videoUrl, slideIndex }: { category: string; items: MenuItem[]; videoUrl: string | null; slideIndex: number }) {
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 2.5rem', overflow: 'hidden', background: 'rgba(255,255,255,0.93)' }}>
        <div style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: '2.5rem', color: '#1a1a1a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>{category}</h2>
            {category === 'Udderly Classic Scoops' && (
              <div style={{ background: '#1a1a1a', color: '#FAF1E9', borderRadius: 8, padding: '0.35rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0, marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🧇</span>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.03em' }}>Add Waffle Bowl</span>
                <span style={{ color: '#C8956C', fontFamily: 'Georgia,serif', fontSize: '1rem', fontWeight: 700 }}>+$1.50</span>
              </div>
            )}
          </div>
          <div style={{ width: 52, height: 4, background: '#C8956C', marginTop: '0.55rem', borderRadius: 2 }} />
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {items.map((item, i) => (  
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', padding: '0.7rem 0', borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#1a1a1a', fontSize: '1.4rem', fontWeight: 600, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                {item.description && <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.8rem', margin: '0.15rem 0 0', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>}
              </div>
              <p style={{ fontFamily: 'Georgia,serif', color: '#C8956C', fontSize: '1.5rem', fontWeight: 700, margin: 0, flexShrink: 0 }}>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <VideoPanel videoUrl={videoUrl} sideImageUrl={slideIndex === 1 ? '/menu-board-slide2.jpg' : slideIndex === 2 ? '/menu-board-slide3.png' : slideIndex === 3 ? '/menu-board-slide4.jpg' : slideIndex === 4 ? '/menu-board-slide5.jpg' : slideIndex === 5 ? '/menu-board-slide6.jpg' : undefined} />
    </div>
  );
}

// Toppings list slide
function ToppingsSlide({ modCats, modifiers, videoUrl, slideIndex }: { modCats: ModifierCategory[]; modifiers: Modifier[]; videoUrl: string | null; slideIndex: number }) {
  const active = modCats.filter(mc => modifiers.some(m => m.modifierCategoryId === mc.id));
  const cols = Math.min(active.length, 3);
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 2.5rem', overflow: 'hidden', background: 'rgba(255,255,255,0.93)' }}>
        <div style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: '2.5rem', color: '#1a1a1a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Toppings &amp; Extras</h2>
          <div style={{ width: 52, height: 4, background: '#C8956C', marginTop: '0.55rem', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: '0.85rem', flex: 1, alignContent: 'start', overflow: 'hidden' }}>
          {active.map(mc => {
            const mods = modifiers.filter(m => m.modifierCategoryId === mc.id);
            return (
              <div key={mc.id} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: '1.1rem', color: '#1a1a1a', margin: '0 0 0.45rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{mc.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {mods.map(mod => (
                    <span key={mod.id} style={{ background: 'rgba(0,0,0,0.06)', color: '#1a1a1a', fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: 999, border: '1px solid rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {mod.name}{mod.price > 0 && <span style={{ color: '#C8956C', fontSize: '0.72rem', fontWeight: 700 }}>+${mod.price.toFixed(2)}</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <VideoPanel videoUrl={videoUrl} sideImageUrl={slideIndex === 1 ? '/menu-board-slide2.jpg' : slideIndex === 2 ? '/menu-board-slide3.png' : slideIndex === 3 ? '/menu-board-slide4.jpg' : slideIndex === 4 ? '/menu-board-slide5.jpg' : slideIndex === 5 ? '/menu-board-slide6.jpg' : undefined} />
    </div>
  );
}

// Main page
function MenuBoardInner() {
  const searchParams = useSearchParams();
  const screen = searchParams.get('screen'); // '1' or '2', null = show all
  const [slides, setSlides] = useState<Slide[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/menu-board-data');
        const data = await res.json();
        if (!res.ok) { if (active) { setErrorMsg(data.error || 'HTTP ' + res.status); setLoading(false); } return; }
        const items = (data.items ?? []) as MenuItem[];
        const modCats = (data.modifierCategories ?? []) as ModifierCategory[];
        const mods = (data.modifiers ?? []) as Modifier[];
        const sorted = [...items].sort((a, b) => {
          const coa = a.categoryOrder ?? 999, cob = b.categoryOrder ?? 999;
          if (coa !== cob) return coa - cob;
          const cc = a.category.localeCompare(b.category);
          if (cc !== 0) return cc;
          const doa = a.displayOrder ?? 999, dob = b.displayOrder ?? 999;
          if (doa !== dob) return doa - dob;
          return a.name.localeCompare(b.name);
        });
        const seen = new Set<string>(); const cats: string[] = [];
        for (const it of sorted) { if (!seen.has(it.category)) { seen.add(it.category); cats.push(it.category); } }
        const newSlides: Slide[] = cats.map(cat => ({ type: 'category' as const, category: cat, items: sorted.filter(i => i.category === cat) }));
        modCats.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        const activeMods = mods.filter(m => m.isActive !== false);
        if (modCats.some(mc => activeMods.some(m => m.modifierCategoryId === mc.id))) {
          newSlides.push({ type: 'toppings' as const, modCats, modifiers: activeMods });
        }
        if (active) { setSlides(newSlides); setVideoUrl(data.videoUrl ?? '/menu-board-bg.mp4'); setLoading(false); }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (active) { setErrorMsg(msg); setLoading(false); }
      }
    };
    load();
    const t = setInterval(load, 60000);
    return () => { active = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => setProgress(Math.min(((Date.now() - start) / SLIDE_DURATION_MS) * 100, 100)), 50);
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentSlide(p => (p + 1) % slides.length); setIsTransitioning(false); }, 400);
    }, SLIDE_DURATION_MS);
    return () => { clearInterval(tick); clearTimeout(timer); };
  }, [currentSlide, slides.length]);

  if (loading || !slides.length) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
        <div style={{ position: 'fixed', inset: 0, background: '#f5f2ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" style={{ width: 220, marginBottom: '1.5rem' }} />
            <p style={{ fontFamily: 'Georgia,serif', fontSize: '2.4rem', color: '#1a1a1a', margin: 0 }}>
              {loading ? 'Loading Menu\u2026' : errorMsg ? 'Error loading menu' : 'No menu items found'}
            </p>
            {errorMsg && <p style={{ color: '#c0392b', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.75rem', maxWidth: 600 }}>{errorMsg}</p>}
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '1.05rem', marginTop: '0.5rem' }}>900 Main Street &bull; Evansville, Indiana</p>
          </div>
        </div>
      </>
    );
  }

  const COW_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Crect width='320' height='320' fill='%23f5f2ee'/%3E%3Cellipse cx='55' cy='45' rx='42' ry='30' fill='%231a1a1a' transform='rotate(-18 55 45)' opacity='.82'/%3E%3Cellipse cx='185' cy='22' rx='30' ry='44' fill='%231a1a1a' transform='rotate(22 185 22)' opacity='.82'/%3E%3Cellipse cx='275' cy='110' rx='44' ry='26' fill='%231a1a1a' transform='rotate(-28 275 110)' opacity='.82'/%3E%3Cellipse cx='95' cy='175' rx='26' ry='42' fill='%231a1a1a' transform='rotate(12 95 175)' opacity='.82'/%3E%3Cellipse cx='220' cy='230' rx='50' ry='30' fill='%231a1a1a' transform='rotate(28 220 230)' opacity='.82'/%3E%3Cellipse cx='22' cy='280' rx='28' ry='22' fill='%231a1a1a' transform='rotate(-22 22 280)' opacity='.82'/%3E%3Cellipse cx='295' cy='290' rx='34' ry='25' fill='%231a1a1a' transform='rotate(18 295 290)' opacity='.82'/%3E%3Cellipse cx='150' cy='100' rx='22' ry='34' fill='%231a1a1a' transform='rotate(38 150 100)' opacity='.82'/%3E%3Cellipse cx='310' cy='185' rx='20' ry='28' fill='%231a1a1a' transform='rotate(-12 310 185)' opacity='.7'/%3E%3Cellipse cx='45' cy='130' rx='18' ry='26' fill='%231a1a1a' transform='rotate(30 45 130)' opacity='.7'/%3E%3C%2Fsvg%3E")`;

  // Split slides by screen param: screen=1 → first 4, screen=2 → remaining
  const visibleSlides = screen === '1' ? slides.slice(0, 4) : screen === '2' ? slides.slice(4) : slides;
  const safeSlide = Math.min(currentSlide, Math.max(visibleSlides.length - 1, 0));
  const slide = visibleSlides[safeSlide] ?? visibleSlides[0];
  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.28}}`}</style>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui,sans-serif', backgroundImage: COW_PATTERN, backgroundSize: '320px 320px', backgroundColor: '#f5f2ee' }}>

        {/* Header */}
        <header style={{ background: '#1a1a1a', padding: '0 2rem', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Cobblestone Creamery" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {visibleSlides.map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === safeSlide ? '#C8956C' : 'rgba(255,255,255,0.25)', transition: 'background 0.4s' }} />)}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.83rem' }}>{safeSlide + 1} / {visibleSlides.length}</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ height: '100%', background: '#C8956C', width: progress + '%', transition: 'width 0.05s linear' }} />
          </div>
        </header>

        {/* Slide */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.4s ease' }}>
          {slide.type === 'category'
            ? <CategorySlide category={slide.category} items={slide.items} videoUrl={videoUrl} slideIndex={slides.indexOf(slide)} />
            : <ToppingsSlide modCats={slide.modCats} modifiers={slide.modifiers} videoUrl={videoUrl} slideIndex={slides.indexOf(slide)} />}
        </div>

        {/* Footer */}
        <footer style={{ background: '#1a1a1a', padding: '0.55rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.04em' }}>900 Main Street &middot; Evansville, Indiana 47708</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Live Menu
          </span>
        </footer>
      </div>
    </>
  );
}

export default function MenuBoardPage() {
  return (
    <Suspense>
      <MenuBoardInner />
    </Suspense>
  );
}
