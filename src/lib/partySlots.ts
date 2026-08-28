/**
 * Office party reservation slot rules — browser mirror.
 *
 * This is the advisory copy, used to grey out slots as the customer picks a
 * date and to show the running "$X to reach the minimum" hint. The
 * authoritative copy is functions/utils/partySlots.js, which re-checks every
 * rule on submit. Keep the two in sync.
 *
 * All time math runs in America/Chicago rather than the visitor's local zone,
 * so someone booking from another timezone still sees the shop's real slots.
 */

const TIME_ZONE = 'America/Chicago';

/** The only pickup times an office party may be booked for. */
export const SLOTS = ['11:00', '12:00', '13:00'] as const;

export type SlotTime = (typeof SLOTS)[number];

/** Minimum order, in cents, before tax. */
export const MIN_SUBTOTAL_CENTS = 7500;

/** How far ahead of the slot the order must be placed. */
export const LEAD_TIME_MINUTES = 45;

/** How far into the future bookings are accepted. */
export const MAX_DAYS_AHEAD = 60;

/**
 * Slots allowed per weekday (0 = Sunday). The shop opens at noon on Sunday, so
 * 11:00 is not bookable that day.
 */
const SLOTS_BY_WEEKDAY: Record<number, readonly string[]> = {
  0: ['12:00', '13:00'],
  1: SLOTS,
  2: SLOTS,
  3: SLOTS,
  4: SLOTS,
  5: SLOTS,
  6: SLOTS,
};

export const SLOT_LABELS: Record<string, string> = {
  '11:00': '11:00 AM',
  '12:00': '12:00 PM',
  '13:00': '1:00 PM',
};

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Minutes America/Chicago is offset from UTC at a given instant. */
function centralOffsetMinutes(date: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );

  return (asIfUtc - date.getTime()) / 60000;
}

/** Resolve a Central wall clock (date + HH:MM) to a real instant. */
export function centralInstant(dateKey: string, time: string): Date | null {
  if (!DATE_KEY_PATTERN.test(String(dateKey || ''))) return null;
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(String(time || ''));
  if (!timeMatch) return null;

  const [year, month, day] = String(dateKey).split('-').map(Number);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (hour > 23 || minute > 59) return null;

  const naive = Date.UTC(year, month - 1, day, hour, minute, 0);
  let instant = naive;
  for (let i = 0; i < 2; i += 1) {
    instant = naive - centralOffsetMinutes(new Date(instant)) * 60000;
  }

  const resolved = new Date(instant);
  return Number.isNaN(resolved.getTime()) ? null : resolved;
}

/** Current date in Central time, as YYYY-MM-DD. */
export function centralDateKey(date: Date = new Date()): string {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

/** Weekday for a date key (0 = Sunday). */
function weekdayForDateKey(dateKey: string): number | null {
  if (!DATE_KEY_PATTERN.test(String(dateKey || ''))) return null;
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Whole days between two date keys. */
function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = String(fromKey).split('-').map(Number);
  const [ty, tm, td] = String(toKey).split('-').map(Number);
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000
  );
}

/** Add days to a date key, staying in calendar space. */
export function addDays(dateKey: string, days: number): string {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

/**
 * Which slots may still be booked for a given date. Filters out slots the shop
 * is closed for, and — for today — slots already inside the lead time.
 */
export function availableSlotsFor(
  dateKey: string,
  now: Date = new Date()
): string[] {
  const weekday = weekdayForDateKey(dateKey);
  if (weekday === null) return [];

  const offset = daysBetween(centralDateKey(now), dateKey);
  if (offset < 0 || offset > MAX_DAYS_AHEAD) return [];

  const cutoff = now.getTime() + LEAD_TIME_MINUTES * 60000;

  return (SLOTS_BY_WEEKDAY[weekday] || []).filter((slot) => {
    const instant = centralInstant(dateKey, slot);
    return instant !== null && instant.getTime() >= cutoff;
  });
}

/** Friendly label for a date key, e.g. "Thursday, August 27". */
export function formatDateKey(dateKey: string): string {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
