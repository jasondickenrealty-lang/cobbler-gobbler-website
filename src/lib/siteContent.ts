import { cookies, draftMode } from 'next/headers';

/**
 * Merchant-editable website content for Cobblestone Creamery.
 *
 * The Website assistant in the admin panel writes to
 * `tenants/cobblestone/site/config`. This module is how that content reaches
 * the public site, so an owner can change hours or put up an announcement
 * without a deploy.
 *
 * WHY IT GOES THROUGH THE API rather than reading Firestore directly:
 * `tenants/*` rules are deliberately closed so a public browser cannot read
 * every merchant's record (see apps/merchant-site/src/lib/firestore.ts), and
 * this app runs on Vercel with only the Firebase client SDK — there is no
 * Google ADC here and no service-account key we want to put in Vercel. The
 * functions API exposes the public-safe subset at /website/public/:tenantId.
 *
 * EVERY FIELD FALLS BACK to the values that were hardcoded in this repo
 * before the config existed. If the API is slow, broken, or the config is
 * missing a field, the site renders exactly what it rendered before —
 * it never renders blank hours or an empty story.
 */

// Server components only — getSiteContent relies on Next's fetch cache for
// revalidation. (No `server-only` import: that package is not a dependency of
// this app, and adding one for a guard comment is not worth the install.)

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');

export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'cobblestone';

/** Holds the owner's private preview token. httpOnly; set by /api/preview. */
export const PREVIEW_COOKIE = 'cbs_preview_token';

/** How many changed-section names the preview banner lists before "+N more". */
export const PREVIEW_CHANGE_LIMIT = 4;

/** Matches the ~1 minute the assistant promises merchants for a change to appear. */
const REVALIDATE_SECONDS = 60;

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

export interface SiteContent {
  hours: DayHours[];
  hoursNote: string;
  announcements: string[];
  hero: HeroContent;
  about: AboutContent;
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

export const FALLBACK_CONTENT: SiteContent = {
  hours: FALLBACK_HOURS,
  hoursNote: '',
  announcements: [],
  hero: { headline: '', sub: '' },
  about: { heading: 'Our Story', body: [] },
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

// ── Loading ──────────────────────────────────────────────────────────────────

function asStringArray(value: unknown, max: number): string[] {
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

/**
 * Fetch the published content every visitor sees. Cached on the same 60s beat
 * the assistant promises for a publish, and never blocking: if the API is slow
 * or broken the caller falls back to the hardcoded content.
 */
async function fetchLive(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${API_BASE}/website/public/${TENANT_ID}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { configured?: boolean; site?: Record<string, unknown> };
    if (body?.configured && body.site && typeof body.site === 'object') return body.site;
    return null;
  } catch {
    // Network/API trouble must never take the site's hours down with it.
    return null;
  }
}

/**
 * Fetch the owner's UNPUBLISHED draft. Only ever called when Draft Mode is on,
 * which only happens after /api/preview verified their token — so reading the
 * cookie here cannot turn a normal visit into a dynamic render.
 */
async function fetchDraft(): Promise<{
  raw: Record<string, unknown> | null;
  pending: string[];
} | null> {
  const token = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!token) return null;

  try {
    // Header, not a query string: a token in a URL ends up in request logs.
    const res = await fetch(`${API_BASE}/website/preview/${TENANT_ID}`, {
      cache: 'no-store',
      headers: { 'x-preview-token': token },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      configured?: boolean;
      site?: Record<string, unknown>;
      pendingChanges?: unknown;
    };
    if (!body?.configured || !body.site || typeof body.site !== 'object') return null;
    return {
      raw: body.site,
      pending: asStringArray(body.pendingChanges, 12),
    };
  } catch {
    return null;
  }
}

/** Shape a raw config document into the content the site renders. */
function toContent(
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
    fromConfig: true,
    isPreview,
    pendingChanges,
  };
}

/**
 * Read the merchant-editable content. Never throws and never returns empty
 * sections — anything missing falls back to the previously hardcoded values.
 *
 * In Draft Mode (the owner opened their private preview link) this returns the
 * unpublished draft instead, so they see exactly what publishing would do.
 * `draftMode()` is checked before `cookies()` on purpose: for an ordinary
 * visitor nothing dynamic is ever read, and these pages stay statically
 * rendered and CDN-cached exactly as they were.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    const draft = await fetchDraft();
    if (draft?.raw) {
      return toContent(draft.raw, { isPreview: true, pendingChanges: draft.pending });
    }
    // Token revoked or the backend is down: show the live site rather than a
    // blank one, and drop the preview badge so nobody trusts a stale draft.
  }

  const raw = await fetchLive();
  if (!raw) return FALLBACK_CONTENT;
  return toContent(raw, { isPreview: false, pendingChanges: [] });
}
