'use client';

import { useEffect, useState } from 'react';

const SLIDE_DURATION_MS = 8000;

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

interface ModifierCategory {
  id: string;
  name: string;
  displayOrder?: number;
}

interface Modifier {
  id: string;
  name: string;
  price: number;
  modifierCategoryId: string;
  isActive?: boolean;
}

type Slide =
  | { type: 'category'; category: string; items: MenuItem[] }
  | { type: 'toppings'; modCats: ModifierCategory[]; modifiers: Modifier[] };

function ItemCard({ item }: { item: MenuItem }) {
  return (
    <div style={{ background: 'rgba(250,241,233,0.07)', border: '1px solid rgba(200,149,108,0.25)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '16/9', background: 'rgba(250,241,233,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        {item.imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🍦</span>
        }
      </div>
      <div style={{ padding: '0.85rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <p style={{ color: '#FAF1E9', fontSize: '1.25rem', fontWeight: 500, margin: 0, lineHeight: 1.2 }}>{item.name}</p>
        {item.description && (
          <p style={{ color: 'rgba(250,241,233,0.4)', fontSize: '0.75rem', margin: 0, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>
        )}
        <p style={{ color: '#C8956C', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Georgia,serif', margin: '0.3rem 0 0' }}>${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

function CategorySlide({ category, items }: { category: string; items: MenuItem[] }) {
  const visible = items.slice(0, 12);
  const cols = visible.length <= 3 ? 3 : visible.length <= 8 ? 4 : 5;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: '3rem', color: '#C8956C', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0 }}>
          {'\u2605'} {category} {'\u2605'}
        </h2>
        <div style={{ width: 60, height: 3, background: '#C8956C', margin: '0.6rem auto 0', borderRadius: 2 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: '1rem', flex: 1, alignContent: 'start', overflow: 'hidden' }}>
        {visible.map(item => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

function ToppingsSlide({ modCats, modifiers }: { modCats: ModifierCategory[]; modifiers: Modifier[] }) {
  const active = modCats.filter(mc => modifiers.some(m => m.modifierCategoryId === mc.id));
  const cols = active.length <= 2 ? 2 : 3;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: '3rem', color: '#C8956C', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0 }}>
          {'\u2605'} Toppings &amp; Extras {'\u2605'}
        </h2>
        <div style={{ width: 60, height: 3, background: '#C8956C', margin: '0.6rem auto 0', borderRadius: 2 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: '1rem', flex: 1, alignContent: 'start', overflow: 'hidden' }}>
        {active.map(mc => {
          const mods = modifiers.filter(m => m.modifierCategoryId === mc.id);
          return (
            <div key={mc.id} style={{ background: 'rgba(250,241,233,0.07)', border: '1px solid rgba(200,149,108,0.25)', borderRadius: 16, padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: '1.5rem', color: '#C8956C', margin: '0 0 0.65rem', fontWeight: 600 }}>{mc.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {mods.map(mod => (
                  <span key={mod.id} style={{ background: 'rgba(250,241,233,0.08)', color: '#FAF1E9', fontSize: '0.95rem', padding: '0.3rem 0.75rem', borderRadius: 999, border: '1px solid rgba(200,149,108,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    {mod.name}
                    {mod.price > 0 && <span style={{ color: '#C8956C', fontSize: '0.8rem' }}>+${mod.price.toFixed(2)}</span>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MenuBoardPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
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
        if (!res.ok) {
          if (active) { setErrorMsg(data.error || `HTTP ${res.status}`); setLoading(false); }
          return;
        }
        const items = (data.items ?? []) as MenuItem[];
        const modifierCategories = (data.modifierCategories ?? []) as ModifierCategory[];
        const modifiers = (data.modifiers ?? []) as Modifier[];

        const sorted = [...items].sort((a, b) => {
          const coa = a.categoryOrder ?? 999, cob = b.categoryOrder ?? 999;
          if (coa !== cob) return coa - cob;
          const cc = a.category.localeCompare(b.category);
          if (cc !== 0) return cc;
          const doa = a.displayOrder ?? 999, dob = b.displayOrder ?? 999;
          if (doa !== dob) return doa - dob;
          return a.name.localeCompare(b.name);
        });

        const seen = new Set<string>();
        const cats: string[] = [];
        for (const item of sorted) {
          if (!seen.has(item.category)) { seen.add(item.category); cats.push(item.category); }
        }

        const newSlides: Slide[] = cats.map(cat => ({
          type: 'category' as const,
          category: cat,
          items: sorted.filter(i => i.category === cat),
        }));

        modifierCategories.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        const activeMods = modifiers.filter(m => m.isActive !== false);
        const hasActiveMods = modifierCategories.some(mc => activeMods.some(m => m.modifierCategoryId === mc.id));
        if (hasActiveMods) newSlides.push({ type: 'toppings' as const, modCats: modifierCategories, modifiers: activeMods });

        if (active) { setSlides(newSlides); setLoading(false); }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (active) { setErrorMsg(msg); setLoading(false); }
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    setProgress(0);
    const start = Date.now();
    const ticker = setInterval(() => setProgress(Math.min(((Date.now() - start) / SLIDE_DURATION_MS) * 100, 100)), 50);
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentSlide(p => (p + 1) % slides.length); setIsTransitioning(false); }, 350);
    }, SLIDE_DURATION_MS);
    return () => { clearInterval(ticker); clearTimeout(timer); };
  }, [currentSlide, slides.length]);

  if (loading || slides.length === 0) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#2C2420}`}</style>
        <div style={{ position: 'fixed', inset: 0, background: '#2C2420', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🍦</div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: '2.5rem', color: '#C8956C', margin: 0 }}>
              {loading ? 'Loading Menu\u2026' : errorMsg ? 'Error loading menu' : 'No menu items found'}
            </p>
            {errorMsg && <p style={{ color: '#f87171', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.75rem', maxWidth: 640 }}>{errorMsg}</p>}
            <p style={{ color: 'rgba(250,241,233,0.4)', fontSize: '1.1rem', marginTop: '0.5rem' }}>900 Main Street · Evansville, Indiana</p>
          </div>
        </div>
      </>
    );
  }

  const slide = slides[currentSlide] ?? slides[0];

  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#2C2420}@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
      <div style={{ position: 'fixed', inset: 0, background: '#2C2420', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui,sans-serif', zIndex: 99999 }}>
        <header style={{ background: '#7B2D3B', padding: '0 2.5rem', height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '2rem' }}>🍦</span>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: '1.65rem', color: '#FAF1E9', fontWeight: 600, letterSpacing: '0.05em' }}>COBBLESTONE CREAMERY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'rgba(250,241,233,0.55)', fontSize: '0.95rem' }}>{currentSlide + 1} / {slides.length}</span>
            <div style={{ display: 'flex', gap: 7 }}>
              {slides.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === currentSlide ? '#C8956C' : 'rgba(250,241,233,0.22)', transition: 'background 0.4s' }} />)}
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4, background: 'rgba(255,255,255,0.12)' }}>
            <div style={{ height: '100%', background: '#C8956C', width: `${progress}%`, transition: 'width 0.05s linear' }} />
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'hidden', padding: '2rem 3rem', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.35s ease' }}>
          {slide.type === 'category'
            ? <CategorySlide category={slide.category} items={slide.items} />
            : <ToppingsSlide modCats={slide.modCats} modifiers={slide.modifiers} />
          }
        </main>
        <footer style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderTop: '1px solid rgba(200,149,108,0.1)' }}>
          <span style={{ color: 'rgba(250,241,233,0.5)', fontSize: '0.95rem', letterSpacing: '0.03em' }}>900 Main Street &middot; Evansville, Indiana 47708</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(250,241,233,0.5)', fontSize: '0.9rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
            Live Menu
          </span>
        </footer>
      </div>
    </>
  );
}
