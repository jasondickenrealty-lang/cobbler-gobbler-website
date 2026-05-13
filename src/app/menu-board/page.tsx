'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const SLIDE_DURATION_MS = 10000;
const ADS_DURATION_MS = 8000;

// ── Screen 3: Ads / Photos / Specials ──────────────────────────────────────
interface AdImage { name: string; url: string; }

function AdsScreen() {
  const [images, setImages] = useState<AdImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/menu-board-ads');
        const data = await res.json();
        if (active) { setImages(data.images ?? []); setLoading(false); }
      } catch { if (active) setLoading(false); }
    };
    load();
    const t = setInterval(load, 60000);
    return () => { active = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => { setCurrent(p => (p + 1) % images.length); setFading(false); }, 600);
    }, ADS_DURATION_MS);
    return () => clearTimeout(timer);
  }, [current, images.length]);

  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#000}`}</style>
      <div className={styles.adsScreen}>
        {loading || images.length === 0 ? (
          <div className={styles.adsPlaceholder}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" className={styles.adsPlaceholderLogo} />
            {!loading && <p className={styles.adsPlaceholderText}>No ads uploaded yet</p>}
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={images[current]?.url}
              src={images[current]?.url}
              alt=""
              className={`${styles.adsImage} ${fading ? styles.adsImageFading : styles.adsImageVisible}`}
            />
            {images.length > 1 && (
              <div className={styles.adsDots}>
                {images.map((_, i) => (
                  <div key={i} className={`${styles.adsDot} ${i === current ? styles.adsDotActive : ''}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

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
      <aside className={styles.videoPanel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sideImageUrl} alt="" className={styles.videoPanelMedia} />
      </aside>
    );
  }
  return (
    <aside className={styles.videoPanel}>
      {videoUrl
        ? <video ref={ref} src={videoUrl} autoPlay loop muted playsInline className={styles.videoPanelMedia} />
        : (
          <div className={styles.brandPlaceholder}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" className={styles.brandLogo} />
            <div className={styles.brandDivider} />
            <p className={styles.brandAddress}>900 Main Street &bull; Evansville, IN</p>
          </div>
        )}
    </aside>
  );
}

// Left-side menu list for a single category
function CategorySlide({ category, items, videoUrl, slideIndex }: { category: string; items: MenuItem[]; videoUrl: string | null; slideIndex: number }) {
  return (
    <div className={styles.slideOuter}>
      <div className={styles.slideContent}>
        <div className={styles.slideHeader}>
          <div className={styles.slideHeaderRow}>
            <h2 className={styles.slideTitle}>{category}</h2>
            {category === 'Udderly Classic Scoops' && (
              <div className={styles.waffleBadge}>
                <span className={styles.waffleBadgeIcon}>🧇</span>
                <span className={styles.waffleBadgeText}>Add Waffle Bowl</span>
                <span className={styles.waffleBadgePrice}>+$1.50</span>
              </div>
            )}
          </div>
          <div className={styles.goldBar} />
        </div>
        <div className={styles.itemsContainer}>
          {items.map((item, i) => (
            <div key={item.id} className={`${styles.itemRow} ${i < items.length - 1 ? styles.itemRowDivider : ''}`}>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                {item.description && <p className={styles.itemDescription}>{item.description}</p>}
              </div>
              <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
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
    <div className={styles.slideOuter}>
      <div className={styles.slideContent}>
        <div className={styles.slideHeader}>
          <h2 className={styles.slideTitle}>Toppings &amp; Extras</h2>
          <div className={styles.goldBar} />
        </div>
        <div className={styles.toppingsGrid} style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
          {active.map(mc => {
            const mods = modifiers.filter(m => m.modifierCategoryId === mc.id);
            return (
              <div key={mc.id} className={styles.modCatCard}>
                <h3 className={styles.modCatName}>{mc.name}</h3>
                <div className={styles.modPillsContainer}>
                  {mods.map(mod => (
                    <span key={mod.id} className={styles.modPill}>
                      {mod.name}{mod.price > 0 && <span className={styles.modPrice}>+${mod.price.toFixed(2)}</span>}
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

// Routes between the ads screen (screen=3) and the main menu board
function MenuBoardInner() {
  const searchParams = useSearchParams();
  const screen = searchParams.get('screen');
  if (screen === '3') return <AdsScreen />;
  return <MenuBoardMain screen={screen} />;
}

function MenuBoardMain({ screen }: { screen: string | null }) {
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

  const visibleSlides = useMemo(
    () => screen === '1' ? slides.slice(0, 4) : screen === '2' ? slides.slice(4) : slides,
    [screen, slides]
  );

  useEffect(() => {
    if (!visibleSlides.length) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => setProgress(Math.min(((Date.now() - start) / SLIDE_DURATION_MS) * 100, 100)), 50);
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentSlide(p => (p + 1) % visibleSlides.length); setIsTransitioning(false); }, 400);
    }, SLIDE_DURATION_MS);
    return () => { clearInterval(tick); clearTimeout(timer); };
  }, [currentSlide, visibleSlides.length]);

  if (loading || !slides.length) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" className={styles.loadingLogo} />
            <p className={styles.loadingTitle}>
              {loading ? 'Loading Menu\u2026' : errorMsg ? 'Error loading menu' : 'No menu items found'}
            </p>
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            <p className={styles.loadingAddress}>900 Main Street &bull; Evansville, Indiana</p>
          </div>
        </div>
      </>
    );
  }

  const COW_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Crect width='320' height='320' fill='%23f5f2ee'/%3E%3Cellipse cx='55' cy='45' rx='42' ry='30' fill='%231a1a1a' transform='rotate(-18 55 45)' opacity='.82'/%3E%3Cellipse cx='185' cy='22' rx='30' ry='44' fill='%231a1a1a' transform='rotate(22 185 22)' opacity='.82'/%3E%3Cellipse cx='275' cy='110' rx='44' ry='26' fill='%231a1a1a' transform='rotate(-28 275 110)' opacity='.82'/%3E%3Cellipse cx='95' cy='175' rx='26' ry='42' fill='%231a1a1a' transform='rotate(12 95 175)' opacity='.82'/%3E%3Cellipse cx='220' cy='230' rx='50' ry='30' fill='%231a1a1a' transform='rotate(28 220 230)' opacity='.82'/%3E%3Cellipse cx='22' cy='280' rx='28' ry='22' fill='%231a1a1a' transform='rotate(-22 22 280)' opacity='.82'/%3E%3Cellipse cx='295' cy='290' rx='34' ry='25' fill='%231a1a1a' transform='rotate(18 295 290)' opacity='.82'/%3E%3Cellipse cx='150' cy='100' rx='22' ry='34' fill='%231a1a1a' transform='rotate(38 150 100)' opacity='.82'/%3E%3Cellipse cx='310' cy='185' rx='20' ry='28' fill='%231a1a1a' transform='rotate(-12 310 185)' opacity='.7'/%3E%3Cellipse cx='45' cy='130' rx='18' ry='26' fill='%231a1a1a' transform='rotate(30 45 130)' opacity='.7'/%3E%3C%2Fsvg%3E")`;

  const safeSlide = Math.min(currentSlide, Math.max(visibleSlides.length - 1, 0));
  const slide = visibleSlides[safeSlide] ?? visibleSlides[0];
  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
      <div className={styles.mainWrapper} style={{ backgroundImage: COW_PATTERN }}>

        {/* Header */}
        <header className={styles.mainHeader}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Cobblestone Creamery" className={styles.headerLogo} />
          <div className={styles.headerRight}>
            <div className={styles.dotsContainer}>
              {visibleSlides.map((_, i) => <div key={i} className={`${styles.dot} ${i === safeSlide ? styles.dotActive : styles.dotInactive}`} />)}
            </div>
            <span className={styles.slideCounter}>{safeSlide + 1} / {visibleSlides.length}</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: progress + '%' }} />
          </div>
        </header>

        {/* Slide */}
        <div className={`${styles.slideWrapper} ${isTransitioning ? styles.slideHidden : styles.slideVisible}`}>
          {slide.type === 'category'
            ? <CategorySlide category={slide.category} items={slide.items} videoUrl={videoUrl} slideIndex={slides.indexOf(slide)} />
            : <ToppingsSlide modCats={slide.modCats} modifiers={slide.modifiers} videoUrl={videoUrl} slideIndex={slides.indexOf(slide)} />}
        </div>

        {/* Footer */}
        <footer className={styles.mainFooter}>
          <span className={styles.footerAddress}>900 Main Street &middot; Evansville, Indiana 47708</span>
          <span className={styles.liveIndicator}>
            <span className={styles.liveDot} />
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
