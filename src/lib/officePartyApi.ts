/**
 * Shared plumbing for the office party proxy routes.
 *
 * Each route under /api/office-party is a thin same-origin proxy in front of
 * the Cloud Function. Validation here is a first pass for fast feedback only —
 * the function re-checks the slot rules, re-prices every line from Firestore
 * and enforces the minimum before it touches a card.
 */

import { NextResponse } from 'next/server';

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5401/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

export const API_BASE = (
  process.env.OFFICE_PARTY_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  DEFAULT_API_BASE
).replace(/\/+$/, '');

export const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
export const HTML_TAG_REGEX = /<[^>]*>/;
export const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const ALLOWED_SLOTS = ['11:00', '12:00', '13:00'];

/** Firestore auto-ids: the share link's whole secret is this string. */
export const PARTY_ID_REGEX = /^[A-Za-z0-9_-]{6,64}$/;

export function clean(value: unknown, maxLen: number) {
  return String(value || '').trim().slice(0, maxLen);
}

/** Same-origin check. Parses the origin rather than substring-matching it. */
export function isSameOrigin(req: Request): boolean {
  const host = req.headers.get('host');
  if (!host) return true;

  const candidate = req.headers.get('origin') || req.headers.get('referer');
  if (!candidate) return true;

  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

export type PartyItem = {
  menuItemId?: string;
  quantity?: number;
  modifiers?: { id?: string }[];
  specialInstructions?: string;
};

/** Normalize the posted lines into the wire shape the function expects. */
export function cleanItems(rawItems: unknown) {
  return (Array.isArray(rawItems) ? (rawItems as PartyItem[]) : [])
    .slice(0, 100)
    .map((item) => ({
      menuItemId: clean(item?.menuItemId, 80),
      quantity: Math.floor(Number(item?.quantity || 0)),
      modifiers: (Array.isArray(item?.modifiers) ? item.modifiers : [])
        .slice(0, 25)
        .map((modifier) => ({ id: clean(modifier?.id, 80) }))
        .filter((modifier) => modifier.id),
      specialInstructions: clean(item?.specialInstructions, 300),
    }));
}

/**
 * Forward to the Cloud Function and hand its answer straight back.
 *
 * The timeout is generous because these round trips include a card
 * authorization or charge; a caller that times out is told to phone in rather
 * than retry, since we cannot tell from here whether the card was touched.
 */
export async function forward(
  path: string,
  init: { method: string; body?: unknown },
  failureMessage: string
) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: init.method,
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: abortController.signal,
      cache: 'no-store',
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error || failureMessage, details: result?.details },
        { status: response.status }
      );
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    console.error(
      'Office party proxy error:',
      timedOut ? 'Request timed out' : (error as Error)?.message || 'Unknown error'
    );
    return NextResponse.json(
      {
        error: timedOut
          ? 'That took too long. Please call us at (812) 499-9866 before trying again, ' +
            'so we can check whether your card was touched.'
          : failureMessage,
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
