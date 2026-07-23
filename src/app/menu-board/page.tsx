'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const ADS_DURATION_MS = 8000;

// Photos are accents, not a catalog — only this many appear per screen.
const MAX_PHOTOS_PER_SCREEN = 3;

// Breathing room so TV overscan (which crops a few percent of every edge)
// can't clip the board. Lower this if the menu looks too inset on the screens.
const FIT_SAFETY = 0.97;

// Backstop against a bad measurement blowing the board up; the real limit is
// the screen width, which is reached long before this.
const MAX_FIT_SCALE = 3;

const VERSION_POLL_MS = 60000;

/**
 * Reloads the board when a new version is deployed. These screens are
 * unattended and their browsers cache hard, so otherwise they keep showing an
 * old build long after the site has been updated.
 */
function useSelfUpdatingBoard() {
  const deployed = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        // Cache-busted: a TV browser will happily serve a stale copy of the
        // very request meant to detect staleness.
        const res = await fetch(`/api/menu-board-version?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok || !active) return;
        const { version } = await res.json();
        if (!version || !active) return;
        if (deployed.current === null) {
          deployed.current = version;
        } else if (deployed.current !== version) {
          window.location.reload();
        }
      } catch {
        // Offline or endpoint down — keep showing the menu and retry next tick.
      }
    };
    check();
    const timer = setInterval(check, VERSION_POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, []);
}

// Staff-only / leftover modifier groups that shouldn't appear on a customer-facing board.
const HIDDEN_MODIFIER_CATEGORIES = new Set(['remove ingredient', 'combo shake', 'new mods']);

// Standalone upsell card, shown right after the scoops it applies to.
const WAFFLE_BOWL_PROMO = {
  kind: 'promo' as const,
  id: 'promo-waffle-bowl',
  title: 'Fresh-Made Waffle Bowl',
  detail: 'Pressed to order — add to any scoop',
  price: '+$1.50',
};
const WAFFLE_BOWL_ANCHOR = 'Udderly Classic Scoops';

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

// ── Menu data types ─────────────────────────────────────────────────────────
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

// A "card" is one self-contained block on the board: a menu category or a toppings group.
type Card =
  | { kind: 'category'; id: string; title: string; items: MenuItem[] }
  | { kind: 'topping'; id: string; title: string; mods: Modifier[] }
  | { kind: 'promo'; id: string; title: string; detail: string; price: string };

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatMoney(value: unknown): string {
  return toNumber(value).toFixed(2);
}

// Rough visual "weight" of a card, used to balance the two screens.
function cardWeight(card: Card): number {
  if (card.kind === 'category') return card.items.length + 1.5;
  if (card.kind === 'promo') return 2;
  return 1 + card.mods.length * 0.3;
}

// Pick the contiguous split point that most evenly divides total weight.
function bestSplit(cards: Card[]): number {
  if (cards.length < 2) return cards.length;
  const weights = cards.map(cardWeight);
  const total = weights.reduce((a, b) => a + b, 0);
  let run = 0, best = 1, bestDiff = Infinity;
  for (let k = 1; k < cards.length; k++) {
    run += weights[k - 1];
    const diff = Math.abs(run - (total - run));
    if (diff < bestDiff) { bestDiff = diff; best = k; }
  }
  return best;
}

// ── Auto-fit: scale a block so it always fits its parent on one static slide ──
function FitToScreen({ children, deps }: { children: React.ReactNode; deps: unknown[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Lay the board out at a given canvas width and report its natural size.
    // Transform is cleared for the measurement so scrollWidth/Height are honest.
    const measureAt = (w: number) => {
      inner.style.width = `${w}px`;
      inner.style.transform = 'none';
      void inner.offsetHeight; // force reflow so the new width takes effect
      return { iw: inner.scrollWidth, ih: inner.scrollHeight };
    };

    const fit = () => {
      const ow = outer.clientWidth;
      const oh = outer.clientHeight;
      if (!ow || !oh) return;
      const aspect = ow / oh;

      // The board area on a TV is wide and short. If we simply scaled a
      // fixed-width canvas to fit, tall content (long shake lists) would be
      // limited by height and shrink into a small block floating in the middle,
      // wasting all the horizontal space.
      //
      // Instead, pick the canvas width that makes the board fill BOTH axes once
      // uniformly scaled. When scaled to fit the height, rendered width is
      // ow · (contentHeight / oh)⁻¹ … the sweet spot is canvasWidth ≈
      // contentHeight × screenAspect. Content height barely moves with width
      // once descriptions stop wrapping, so measure a wide layout for the height
      // floor, aim for that width, then refine once for the mild coupling.
      let m = measureAt(ow * 1.6);
      if (!m.ih) return;
      let w = m.ih * aspect;
      m = measureAt(w);
      w = (m.ih || 1) * aspect;
      // Guardrails so a bad measurement can't blow the board up or collapse it.
      w = Math.max(ow * 0.5, Math.min(w, ow * 3));
      m = measureAt(w);
      if (!m.iw || !m.ih) return;

      const next = Math.min((ow / m.iw) * FIT_SAFETY, (oh / m.ih) * FIT_SAFETY, MAX_FIT_SCALE);
      inner.style.width = `${w}px`;
      inner.style.transform = `scale(${next})`;
      setScale(prev => (Math.abs(prev - next) > 0.005 ? next : prev));
    };

    fit();
    // Observe only the outer box (window/screen size). We deliberately do NOT
    // observe inner: fit() changes inner's width, which would retrigger the
    // observer and loop. Content changes arrive through `deps` instead.
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <div ref={outerRef} className={styles.fitOuter}>
      <div ref={innerRef} className={styles.fitInner} style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

// ── Single card renderers ───────────────────────────────────────────────────
function CategoryCard({
  card,
  photoItemIds,
}: {
  card: Extract<Card, { kind: 'category' }>;
  photoItemIds: Set<string>;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{card.title}</h2>
        <div className={styles.goldBar} />
      </div>
      <div>
        {card.items.map((item, i) => (
          <div key={item.id} className={`${styles.itemRow} ${i < card.items.length - 1 ? styles.itemRowDivider : ''}`}>
            {photoItemIds.has(item.id) && item.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={item.imageUrl} alt="" className={styles.itemThumb} decoding="async" />
            )}
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              {item.description && <p className={styles.itemDescription}>{item.description}</p>}
            </div>
            <p className={styles.itemPrice}>${formatMoney(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoCard({ card }: { card: Extract<Card, { kind: 'promo' }> }) {
  return (
    <div className={`${styles.card} ${styles.promoCard}`}>
      <span className={styles.promoIcon}>🧇</span>
      <div className={styles.promoBody}>
        <h3 className={styles.promoTitle}>{card.title}</h3>
        <p className={styles.promoDetail}>{card.detail}</p>
      </div>
      <span className={styles.promoPrice}>{card.price}</span>
    </div>
  );
}

function ToppingCard({ card }: { card: Extract<Card, { kind: 'topping' }> }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.modCatName}>{card.title}</h3>
      </div>
      <div className={styles.modPillsContainer}>
        {card.mods.map(mod => (
          <span key={mod.id} className={styles.modPill}>
            {mod.name}{toNumber(mod.price) > 0 && <span className={styles.modPrice}>+${formatMoney(mod.price)}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Routing between ads screen and the static menu board ────────────────────
function MenuBoardInner() {
  const searchParams = useSearchParams();
  const screen = searchParams.get('screen');
  useSelfUpdatingBoard();
  if (screen === '3') return <AdsScreen />;
  return <MenuBoardMain screen={screen} />;
}

function MenuBoardMain({ screen }: { screen: string | null }) {
  const [cards, setCards] = useState<Card[]>([]);
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

        // One card per category, in menu order.
        const seen = new Set<string>();
        const catOrder: string[] = [];
        for (const it of sorted) { if (!seen.has(it.category)) { seen.add(it.category); catOrder.push(it.category); } }
        const newCards: Card[] = [];
        for (const cat of catOrder) {
          newCards.push({
            kind: 'category' as const,
            id: `cat-${cat}`,
            title: cat,
            items: sorted.filter(i => i.category === cat),
          });
          if (cat === WAFFLE_BOWL_ANCHOR) newCards.push(WAFFLE_BOWL_PROMO);
        }
        // Anchor category missing (renamed/removed) — still show the upsell.
        if (!newCards.some(c => c.kind === 'promo')) newCards.push(WAFFLE_BOWL_PROMO);

        // One card per active toppings/modifier group, in display order.
        const activeMods = mods.filter(m => m.isActive !== false);
        [...modCats]
          .filter(mc => !HIDDEN_MODIFIER_CATEGORIES.has((mc.name ?? '').trim().toLowerCase()))
          .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
          .forEach(mc => {
            const groupMods = activeMods.filter(m => m.modifierCategoryId === mc.id);
            if (groupMods.length) {
              newCards.push({ kind: 'topping' as const, id: `mod-${mc.id}`, title: mc.name, mods: groupMods });
            }
          });

        if (active) { setCards(newCards); setErrorMsg(''); setLoading(false); }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (active) { setErrorMsg(msg); setLoading(false); }
      }
    };
    load();
    const t = setInterval(load, 60000);
    return () => { active = false; clearInterval(t); };
  }, []);

  // Auto-balance the cards across the two menu TVs by weight.
  const visibleCards = useMemo(() => {
    if (screen !== '1' && screen !== '2') return cards;
    const k = bestSplit(cards);
    return screen === '1' ? cards.slice(0, k) : cards.slice(k);
  }, [screen, cards]);

  // A few photos as accents rather than one per item — at most one per category,
  // spread down the board. Chosen from the card list itself so it stays stable
  // across the 60s refresh instead of shuffling on screen.
  const photoItemIds = useMemo(() => {
    const picked = new Set<string>();
    for (const card of visibleCards) {
      if (picked.size >= MAX_PHOTOS_PER_SCREEN) break;
      if (card.kind !== 'category') continue;
      const withPhoto = card.items.find(item => item.imageUrl?.trim());
      if (withPhoto) picked.add(withPhoto.id);
    }
    return picked;
  }, [visibleCards]);

  // Column count scales with how much content this screen holds.
  const columnCount = useMemo(() => {
    const n = visibleCards.length;
    if (n <= 1) return 1;
    if (n <= 3) return 2;
    return 3;
  }, [visibleCards.length]);

  if (loading || !cards.length) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" className={styles.loadingLogo} />
            <p className={styles.loadingTitle}>
              {loading ? 'Loading Menu…' : errorMsg ? 'Error loading menu' : 'No menu items found'}
            </p>
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            <p className={styles.loadingAddress}>900 Main Street &bull; Evansville, Indiana</p>
          </div>
        </div>
      </>
    );
  }

  if (!visibleCards.length) {
    return (
      <>
        <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Cobblestone Creamery" className={styles.loadingLogo} />
            <p className={styles.loadingTitle}>No items for this screen</p>
            <p className={styles.loadingAddress}>900 Main Street &bull; Evansville, Indiana</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:#f5f2ee}`}</style>
      <div className={`${styles.mainWrapper} ${styles.cowPattern}`}>

        {/* Header */}
        <header className={styles.mainHeader}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Cobblestone Creamery" className={styles.headerLogo} />
          <div className={styles.headerRight}>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} /> Live Menu
            </span>
          </div>
        </header>

        {/* Static, auto-fitted menu board */}
        <div className={styles.boardBody}>
          <FitToScreen deps={[visibleCards, columnCount]}>
            <div className={styles.boardColumns} style={{ columnCount }}>
              {visibleCards.map(card =>
                card.kind === 'category'
                  ? <CategoryCard key={card.id} card={card} photoItemIds={photoItemIds} />
                  : card.kind === 'promo'
                    ? <PromoCard key={card.id} card={card} />
                    : <ToppingCard key={card.id} card={card} />
              )}
            </div>
          </FitToScreen>
        </div>
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
