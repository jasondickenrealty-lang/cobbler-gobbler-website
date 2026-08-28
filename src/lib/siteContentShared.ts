/**
 * The half of the site-content module that is safe in a client bundle.
 *
 * `siteContent.ts` statically imports `next/headers` for Draft Mode, which
 * makes the whole module unusable from a `'use client'` file — and the Footer,
 * PreviewBanner and SiteContentContext all need the types, the fallbacks and
 * the hours formatting. Those live here so the client can import them without
 * dragging a server-only API along; `siteContent.ts` re-exports everything so
 * existing server-side imports keep working unchanged.
 *
 * Nothing in this file may import `next/headers`, `next/cache`, or anything
 * else that is server-only.
 */

import { FEATURED_FLAVORS } from '@/shared/featured-flavors';

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');

export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'cobblestone';

/** Holds the owner's private preview token. httpOnly; set by /api/preview. */
export const PREVIEW_COOKIE = 'cbs_preview_token';

/** Ceiling on the flavor lineup. Mirrored by MAX_FLAVORS in functions/utils/siteTools.js. */
export const MAX_FLAVORS = 16;

/** How many changed-section names the preview banner lists before "+N more". */
export const PREVIEW_CHANGE_LIMIT = 4;

/** Matches the ~1 minute the assistant promises merchants for a change to appear. */
export const REVALIDATE_SECONDS = 60;

// ── Types ────────────────────────────────────────────────────────────────────

export interface DayHours {
  day: string;
  /** 24h "HH:MM"; null on both = closed that day. */
  open: string | null;
  close: string | null;
  /** Optional second window for a day that closes midday and reopens. */
  open2?: string | null;
  close2?: string | null;
}

export interface AboutContent {
  heading: string;
  body: string[];
}

export interface HeroContent {
  headline: string;
  sub: string;
}

export interface FeaturedFlavor {
  /** "Mint Chocolate Chip" */
  name: string;
  /**
   * Same-origin path from public/, or an https photo the owner uploaded.
   * Optional: a flavor with no photo renders the drawn <FlavorCone /> instead,
   * so the lineup can list everything in the case without waiting on a shoot.
   */
  image?: string;
  /** Overrides the generated alt text when the owner wrote their own. */
  alt?: string;
  /** One-liner shown beside the flavor on the home page. */
  blurb?: string;
}

export interface SiteContent {
  hours: DayHours[];
  hoursNote: string;
  announcements: string[];
  hero: HeroContent;
  about: AboutContent;
  /**
   * The flavor lineup the site shows. Empty is a real answer — it means the
   * owner cleared the list, and the flavor sections come off the page.
   */
  featuredFlavors: FeaturedFlavor[];
  /** True when the live config was reached; false means everything is fallback. */
  fromConfig: boolean;
  /** True when this browser is looking at the owner's unpublished draft. */
  isPreview: boolean;
  /** Plain-English list of what is unpublished, for the preview banner. */
  pendingChanges: string[];
}

// ── Fallback: what the site showed before the config existed ─────────────────

const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Mon-Thu 11-2 & 4-9, Fri 11-2 & 4-10, Sat 11-10, Sun 12-6. */
const FALLBACK_HOURS: DayHours[] = [
  { day: 'Monday', open: '11:00', close: '14:00', open2: '16:00', close2: '21:00' },
  { day: 'Tuesday', open: '11:00', close: '14:00', open2: '16:00', close2: '21:00' },
  { day: 'Wednesday', open: '11:00', close: '14:00', open2: '16:00', close2: '21:00' },
  { day: 'Thursday', open: '11:00', close: '14:00', open2: '16:00', close2: '21:00' },
  { day: 'Friday', open: '11:00', close: '14:00', open2: '16:00', close2: '22:00' },
  { day: 'Saturday', open: '11:00', close: '22:00', open2: null, close2: null },
  { day: 'Sunday', open: '12:00', close: '18:00', open2: null, close2: null },
];

/**
 * What the flavor grids showed when the lineup was a hardcoded array in this
 * repo. Still the source of truth until an owner edits it in the admin panel,
 * so a missing or unreachable config renders exactly the old page.
 */
const FALLBACK_FLAVORS: FeaturedFlavor[] = FEATURED_FLAVORS.map(({ name, image }) => ({
  name,
  ...(image ? { image } : {}),
}));

export const FALLBACK_CONTENT: SiteContent = {
  hours: FALLBACK_HOURS,
  hoursNote: '',
  announcements: [],
  hero: { headline: '', sub: '' },
  about: { heading: 'Our Story', body: [] },
  featuredFlavors: FALLBACK_FLAVORS,
  fromConfig: false,
  isPreview: false,
  pendingChanges: [],
};

// ── Formatting ───────────────────────────────────────────────────────────────

/** "14:00" -> "2:00 PM". Minutes are always shown, matching the site's style. */
export function clockLabel(value: string): string {
  const [h, m] = value.split(':');
  const hours = Number(h);
  if (!Number.isFinite(hours) || hours < 0 || hours > 23) return value;
  const suffix = hours < 12 ? 'AM' : 'PM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${m} ${suffix}`;
}

/** "11:00 AM - 2:00 PM, 4:00 PM - 9:00 PM", or "Closed". */
export function hoursValue(entry: DayHours): string {
  if (!entry.open || !entry.close) return 'Closed';
  const first = `${clockLabel(entry.open)} - ${clockLabel(entry.close)}`;
  if (entry.open2 && entry.close2) {
    return `${first}, ${clockLabel(entry.open2)} - ${clockLabel(entry.close2)}`;
  }
  return first;
}

function sameWindows(a: DayHours, b: DayHours): boolean {
  return (
    a.open === b.open &&
    a.close === b.close &&
    (a.open2 ?? null) === (b.open2 ?? null) &&
    (a.close2 ?? null) === (b.close2 ?? null)
  );
}

export interface HoursLine {
  /** "Monday - Thursday" or "Saturday" */
  label: string;
  /** "11:00 AM - 2:00 PM, 4:00 PM - 9:00 PM" */
  value: string;
}

/**
 * Collapse consecutive days that share the same windows into one line, which
 * is how the site has always displayed hours ("Monday - Thursday: ...").
 */
export function hoursLines(hours: DayHours[]): HoursLine[] {
  const ordered = DAY_ORDER.map((day) => hours.find((h) => h.day === day)).filter(
    (h): h is DayHours => Boolean(h),
  );
  if (!ordered.length) return [];

  const lines: HoursLine[] = [];
  let start = 0;

  for (let i = 1; i <= ordered.length; i += 1) {
    const ends = i === ordered.length || !sameWindows(ordered[i], ordered[start]);
    if (!ends) continue;

    const first = ordered[start].day;
    const last = ordered[i - 1].day;
    lines.push({
      label: start === i - 1 ? first : `${first} - ${last}`,
      value: hoursValue(ordered[start]),
    });
    start = i;
  }

  return lines;
}

/** One sentence covering the whole week, for the FAQ answer and chat replies. */
export function hoursSentence(hours: DayHours[]): string {
  const lines = hoursLines(hours);
  if (!lines.length) return '';
  const parts = lines.map(({ label, value }) => {
    const days = label.replace(' - ', ' through ');
    if (value === 'Closed') return `closed ${days}`;
    return `open ${days} from ${value.replace(/ - /g, ' to ').replace(/, /g, ' and ')}`;
  });
  return `We are ${parts.join(', ')}.`;
}

/**
 * Alt text for a flavor photo. The owner can write their own; when they have
 * not, this is the sentence the pages already used before the lineup became
 * editable, so nothing regresses for screen readers or image search.
 */
export function flavorAlt(flavor: FeaturedFlavor): string {
  return flavor.alt || `${flavor.name} ice cream at Cobblestone Creamery`;
}

// ── Parsing ──────────────────────────────────────────────────────────────────

/**
 * Photo hosts this site can render. next/image only accepts hosts listed in
 * next.config.js remotePatterns, so an entry pointing anywhere else would take
 * the whole page down with a 500 rather than just showing a broken image. The
 * backend tool refuses to write one; this is the second lock on the same door,
 * because the page has to survive a config written by some older version of it.
 */
const IMAGE_HOSTS = new Set(['firebasestorage.googleapis.com', 'storage.googleapis.com']);

function asImageSrc(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!raw || raw.includes('..')) return null;
  // Same-origin path into this app's public/ folder. "//host" only looks local.
  if (raw.startsWith('/')) return raw.startsWith('//') ? null : raw;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    return IMAGE_HOSTS.has(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * null means "the config has nothing to say about flavors" — the caller falls
 * back to the built-in lineup. An empty array means the owner cleared the list
 * on purpose, and the sections come off the page. Those are different answers.
 */
function asFeaturedFlavors(value: unknown): FeaturedFlavor[] | null {
  if (!Array.isArray(value)) return null;

  const seen = new Set<string>();
  const flavors: FeaturedFlavor[] = [];

  for (const raw of value.slice(0, MAX_FLAVORS)) {
    const entry = (raw ?? {}) as Record<string, unknown>;
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    // A flavor with no usable photo still belongs on the page — it draws a cone.
    const image = asImageSrc(entry.image);
    if (!name) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const alt = typeof entry.alt === 'string' ? entry.alt.trim() : '';
    const blurb = typeof entry.blurb === 'string' ? entry.blurb.trim() : '';
    flavors.push({
      name,
      ...(image ? { image } : {}),
      ...(alt ? { alt } : {}),
      ...(blurb ? { blurb } : {}),
    });
  }

  return flavors;
}

export function asStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

function asHours(value: unknown): DayHours[] | null {
  if (!Array.isArray(value) || !value.length) return null;
  const parsed = value
    .map((raw): DayHours | null => {
      const d = (raw ?? {}) as Record<string, unknown>;
      const day = typeof d.day === 'string' ? d.day : '';
      if (!DAY_ORDER.includes(day as (typeof DAY_ORDER)[number])) return null;
      const time = (v: unknown) =>
        typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : null;
      const open = time(d.open);
      const open2 = time(d.open2);
      const close2 = time(d.close2);
      return {
        day,
        open,
        close: time(d.close),
        // Half a window is not a window.
        open2: open && open2 && close2 ? open2 : null,
        close2: open && open2 && close2 ? close2 : null,
      };
    })
    .filter((d): d is DayHours => d !== null);
  return parsed.length ? parsed : null;
}

/** Shape a raw config document into the content the site renders. */
export function toContent(
  raw: Record<string, unknown>,
  { isPreview, pendingChanges }: { isPreview: boolean; pendingChanges: string[] }
): SiteContent {
  const about = (raw.about ?? {}) as Record<string, unknown>;
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const aboutBody = asStringArray(about.body, 12);

  return {
    hours: asHours(raw.hours) ?? FALLBACK_CONTENT.hours,
    hoursNote: typeof raw.hoursNote === 'string' ? raw.hoursNote.trim() : FALLBACK_CONTENT.hoursNote,
    announcements: asStringArray(raw.announcements, 5),
    hero: {
      headline:
        typeof hero.headline === 'string' && hero.headline.trim()
          ? hero.headline.trim()
          : FALLBACK_CONTENT.hero.headline,
      sub:
        typeof hero.sub === 'string' && hero.sub.trim()
          ? hero.sub.trim()
          : FALLBACK_CONTENT.hero.sub,
    },
    about: {
      heading:
        typeof about.heading === 'string' && about.heading.trim()
          ? about.heading.trim()
          : FALLBACK_CONTENT.about.heading,
      body: aboutBody.length ? aboutBody : FALLBACK_CONTENT.about.body,
    },
    featuredFlavors: asFeaturedFlavors(raw.featuredFlavors) ?? FALLBACK_CONTENT.featuredFlavors,
    fromConfig: true,
    isPreview,
    pendingChanges,
  };
}
