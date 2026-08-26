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

// Standalone upsell card, shown right after the scoops it applies to.
const WAFFLE_BOWL_PROMO = {
  kind: 'promo' as const,
  id: 'promo-waffle-bowl',
  title: 'Fresh-Made Waffle Bowl',
  detail: 'Pressed to order — add to any scoop',
  price: '+$1.50',
};
const WAFFLE_BOWL_ANCHOR = 'Udderly Classic Scoops';

// Second callout, rendered with the same promo styling and pinned directly
// under the waffle one. Hardcoded for the same reason the waffle promo is:
// it is an upsell on the scoops, not a menu category of its own.
const COOKIE_DOUGH_PROMO = {
  kind: 'promo' as const,
  id: 'promo-cookie-dough',
  title: 'Add Cookie Dough',
  detail: 'Scooped fresh — add to any scoop',
  price: '+$1.00',
  icon: '🍪',
};

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
  /** Description of the category this item belongs to, set in POS → Menu Management. */
  categoryDescription?: string;
}
/**
 * Where a modifier group appears on these boards, set per group in POS →
 * Menu Management → Modifiers. Anything without a placement stays off the
 * screens, so a new group never lands on the TVs by surprise.
 */
type BoardPlacement = 'hidden' | 'card' | 'item';
interface ModifierCategory {
  id: string;
  name: string;
  displayOrder?: number;
  boardPlacement?: BoardPlacement;
  boardAnchorItemId?: string;
}
interface Modifier {
  id: string;
  name: string;
  price: number;
  modifierCategoryId: string;
  isActive?: boolean;
  showOnMenuBoard?: boolean;
}

// A group rendered inline under one menu item rather than as its own card.
interface ItemAddOnGroup { id: string; label: string; mods: Modifier[] }

// A "card" is one self-contained block on the board: a menu category or a toppings group.
type Card =
  | { kind: 'category'; id: string; title: string; description?: string; items: MenuItem[]; addOns: Record<string, ItemAddOnGroup[]> }
  | { kind: 'topping'; id: string; title: string; mods: Modifier[] }
  | { kind: 'promo'; id: string; title: string; detail: string; price: string; icon?: string };

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatMoney(value: unknown): string {
  return toNumber(value).toFixed(2);
}

// Rough visual "weight" of a card, used to balance the two screens.
function cardWeight(card: Card): number {
  if (card.kind === 'category') {
    // Inline add-on lines make a category card taller. Ignoring them skews the
    // split and can push one screen's content off the bottom.
    // A category description adds a wrapped line or two under the title, so it
    // counts toward the weight alongside the add-on lines.
    const addOnRows = Object.values(card.addOns).reduce((sum, groups) => sum + groups.length, 0);
    return card.items.length + addOnRows * 0.6 + 1.5 + (card.description ? 0.6 : 0);
  }
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

// Screen 1 ends wherever the weight balance lands, which left a tall gap in its
// last column. Naming a card here forces screen 1 to run THROUGH that card, so
// screen 2 starts with the next one. Matching ignores case, spaces and dashes.
// Blank or no match = fall back to the automatic balance, so a renamed or
// deleted category can never blank out a screen. `?split=<n>` beats both, for
// trying a break point on a TV without a deploy.
const SCREEN_1_LAST_CARD = 'Moo-Shakes';

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function splitPoint(cards: Card[], override: string | null): number {
  const manual = Number(override);
  if (override && Number.isInteger(manual) && manual > 0 && manual < cards.length) return manual;

  const pin = normalizeTitle(SCREEN_1_LAST_CARD);
  if (pin) {
    const i = cards.findIndex(c => normalizeTitle(c.title) === pin);
    // Last card overall would leave screen 2 empty — let the balancer decide.
    if (i >= 0 && i + 1 < cards.length) return i + 1;
  }
  return bestSplit(cards);
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

    // The multi-column element itself. column-fill does not inherit, so it has
    // to be switched on that element rather than on the canvas wrapper.
    const cols = inner.querySelector<HTMLElement>('[data-board-columns]');

    // Lay the board out at a given canvas width with balanced columns, letting
    // height fall out of the content, and report its natural size.
    // Transform is cleared for the measurement so scrollWidth/Height are honest.
    const measureAt = (w: number) => {
      if (cols) cols.style.columnFill = 'balance';
      inner.style.width = `${w}px`;
      inner.style.height = '';
      inner.style.transform = 'none';
      void inner.offsetHeight; // force reflow so the new width takes effect
      return { iw: inner.scrollWidth, ih: inner.scrollHeight };
    };

    // Lay the board out on a fixed canvas with columns filling in order.
    // Anything that does not fit spills into extra columns off the right edge,
    // which is what `overflows` detects.
    const layoutAt = (w: number, h: number) => {
      if (cols) cols.style.columnFill = '';
      inner.style.width = `${w}px`;
      inner.style.height = `${h}px`;
      inner.style.transform = 'none';
      void inner.offsetHeight;
      return { overflows: cols ? cols.scrollWidth > cols.clientWidth + 1 : false };
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
      // Instead, pick a canvas whose shape matches the screen, so scaling fills
      // both axes at once. With canvasWidth = canvasHeight × screenAspect the
      // two fit ratios are equal, and the board fills the screen exactly.
      // Measuring balanced first gives a good starting height: it is the
      // shortest the columns could ever be.
      let m = measureAt(ow * 1.6);
      if (!m.ih) return;
      m = measureAt(m.ih * aspect);
      let h = m.ih;
      if (!h) return;

      // Filling columns in order needs more height than balancing them, because
      // a card that overhangs the bottom moves on whole and leaves the gap. Grow
      // the canvas until every card fits in the columns we have.
      let fits = false;
      for (let i = 0; i < 28 && !fits; i++) {
        const w = Math.max(ow * 0.5, Math.min(h * aspect, ow * 3));
        fits = !layoutAt(w, h).overflows;
        if (!fits) h *= 1.06;
      }

      if (!fits) {
        // Could not place every card in order — fall back to balanced columns so
        // the board still shows the whole menu rather than clipping it.
        const b = measureAt(Math.max(ow * 0.5, Math.min(h * aspect, ow * 3)));
        if (!b.iw || !b.ih) return;
        const back = Math.min((ow / b.iw) * FIT_SAFETY, (oh / b.ih) * FIT_SAFETY, MAX_FIT_SCALE);
        inner.style.transform = `scale(${back})`;
        setScale(prev => (Math.abs(prev - back) > 0.005 ? back : prev));
        return;
      }

      const w = Math.max(ow * 0.5, Math.min(h * aspect, ow * 3));
      const next = Math.min((ow / w) * FIT_SAFETY, (oh / h) * FIT_SAFETY, MAX_FIT_SCALE);
      inner.style.width = `${w}px`;
      inner.style.height = `${h}px`;
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

    // Photos land after the first layout pass and make their cards taller. The
    // columns are sized from those heights now, so a stale measurement would
    // push the last cards off the right edge instead of merely unbalancing the
    // board. Re-fit as each one arrives.
    const pending = Array.from(inner.querySelectorAll('img')).filter(img => !img.complete);
    pending.forEach(img => {
      img.addEventListener('load', fit);
      img.addEventListener('error', fit);
    });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
      pending.forEach(img => {
        img.removeEventListener('load', fit);
        img.removeEventListener('error', fit);
      });
    };
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
        {card.description && <p className={styles.cardDescription}>{card.description}</p>}
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
              {(card.addOns[item.id] ?? []).map(group => (
                <p key={group.id} className={styles.itemAddOns}>
                  <span className={styles.itemAddOnsLabel}>{group.label}</span>
                  {group.mods.map((mod, mi) => (
                    <span key={mod.id} className={styles.itemAddOn}>
                      {mi > 0 && <span className={styles.itemAddOnSep}>·</span>}
                      {mod.name}
                      {toNumber(mod.price) > 0 && (
                        <span className={styles.itemAddOnPrice}>+${formatMoney(mod.price)}</span>
                      )}
                    </span>
                  ))}
                </p>
              ))}
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
      <span className={styles.promoIcon}>{card.icon ?? '🧇'}</span>
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
  const split = searchParams.get('split');
  useSelfUpdatingBoard();
  if (screen === '3') return <AdsScreen />;
  return <MenuBoardMain screen={screen} split={split} />;
}

function MenuBoardMain({ screen, split }: { screen: string | null; split: string | null }) {
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

        // A real "Waffle Bowl" category set up in the POS makes the bowl's price and
        // menu position editable there. When present, we render THAT category with the
        // promo callout styling (not a plain category card) at its POS-ordered spot,
        // driving the title/detail/price from its item, and suppress the hardcoded
        // promo below so the bowl never shows twice. Until a POS Waffle Bowl category
        // exists, the hardcoded promo stays as a fallback so the upsell never
        // disappears from the TVs.
        const isWaffleBowlCat = (cat: string) => cat.toLowerCase().includes('waffle bowl');
        const hasWaffleBowlCategory = catOrder.some(isWaffleBowlCat);

        // Modifier groups are opt-in: a group is only on the boards if someone
        // gave it a placement in Menu Management. That keeps staff-only groups
        // and add-ons that already have their own menu card off the screens
        // without anyone editing this file.
        const boardMods = mods.filter(m => m.isActive !== false && m.showOnMenuBoard !== false);
        const placedCats = [...modCats]
          .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
          .map(mc => ({ mc, mods: boardMods.filter(m => m.modifierCategoryId === mc.id) }))
          .filter(({ mods: groupMods }) => groupMods.length > 0);

        // Groups pinned under one specific menu item, keyed by that item's id.
        const addOnsByItemId: Record<string, ItemAddOnGroup[]> = {};
        const cardGroups: { mc: ModifierCategory; mods: Modifier[] }[] = [];
        for (const entry of placedCats) {
          const { mc, mods: groupMods } = entry;
          if (mc.boardPlacement === 'card') { cardGroups.push(entry); continue; }
          if (mc.boardPlacement !== 'item') continue;

          const anchorId = (mc.boardAnchorItemId ?? '').trim();
          const anchor = anchorId ? sorted.find(i => i.id === anchorId) : undefined;
          // The anchor can fail three ways: the item was deleted, it is marked
          // unavailable so it never reaches the board, or it lives in the Waffle
          // Bowl category, which renders as a promo callout with no item rows to
          // hang an add-on line under. In every case fall back to the group's own
          // card — the operator asked for these on the TVs, and showing them in a
          // slightly different place beats them vanishing with no explanation.
          if (!anchor || isWaffleBowlCat(anchor.category)) { cardGroups.push(entry); continue; }

          (addOnsByItemId[anchorId] ??= []).push({
            id: `addon-${mc.id}`,
            label: (mc.name ?? '').trim(),
            mods: groupMods,
          });
        }

        const newCards: Card[] = [];
        for (const cat of catOrder) {
          if (isWaffleBowlCat(cat)) {
            const bowlItem = sorted.find(i => i.category === cat);
            const price = bowlItem && toNumber(bowlItem.price) > 0
              ? `+$${formatMoney(bowlItem.price)}`
              : WAFFLE_BOWL_PROMO.price;
            newCards.push({
              kind: 'promo' as const,
              id: `promo-${cat}`,
              title: bowlItem?.name?.trim() || WAFFLE_BOWL_PROMO.title,
              detail: bowlItem?.description?.trim() || WAFFLE_BOWL_PROMO.detail,
              price,
            });
            newCards.push(COOKIE_DOUGH_PROMO);
            continue;
          }
          const catItems = sorted.filter(i => i.category === cat);
          const catAddOns: Record<string, ItemAddOnGroup[]> = {};
          for (const item of catItems) {
            if (addOnsByItemId[item.id]) catAddOns[item.id] = addOnsByItemId[item.id];
          }
          newCards.push({
            kind: 'category' as const,
            id: `cat-${cat}`,
            title: cat,
            // Every item in a category carries the same category description; take
            // the first non-empty one so a stale blank on one item can't hide it.
            description: catItems.find(i => i.categoryDescription?.trim())?.categoryDescription?.trim(),
            items: catItems,
            addOns: catAddOns,
          });
          if (!hasWaffleBowlCategory && cat === WAFFLE_BOWL_ANCHOR) newCards.push(WAFFLE_BOWL_PROMO, COOKIE_DOUGH_PROMO);
        }
        // Anchor category missing (renamed/removed) — still show the upsell,
        // unless a POS Waffle Bowl category is already providing it.
        if (!hasWaffleBowlCategory && !newCards.some(c => c.kind === 'promo')) newCards.push(WAFFLE_BOWL_PROMO, COOKIE_DOUGH_PROMO);

        // One card per group set to "own card" (plus any anchored group whose
        // item could not be found), in display order.
        for (const { mc, mods: groupMods } of cardGroups) {
          newCards.push({ kind: 'topping' as const, id: `mod-${mc.id}`, title: mc.name, mods: groupMods });
        }

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
    const k = splitPoint(cards, split);
    return screen === '1' ? cards.slice(0, k) : cards.slice(k);
  }, [screen, cards, split]);

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
            <div className={styles.boardColumns} data-board-columns style={{ columnCount }}>
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
