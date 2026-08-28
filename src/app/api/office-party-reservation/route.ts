import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Proxy for office party reservations.
 *
 * Mirrors api/job-application/route.ts: same CSRF check, field cleaning and
 * upstream timeout. Validation here is a first pass for fast feedback — the
 * Cloud Function re-checks the slot rules, re-prices every line from Firestore
 * and enforces the $75 minimum before it charges anything.
 */

type ReservationItem = {
  menuItemId?: string;
  quantity?: number;
  modifiers?: { id?: string }[];
  specialInstructions?: string;
};

type ReservationPayload = {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  contactName?: string;
  contactPhone?: string;
  email?: string;
  specialRequests?: string;
  pickupDate?: string;
  pickupTime?: string;
  items?: ReservationItem[];
  nmiPaymentToken?: string;
};

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const HTML_TAG_REGEX = /<[^>]*>/;
const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_SLOTS = ['11:00', '12:00', '13:00'];

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5401/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

const API_BASE = (
  process.env.OFFICE_PARTY_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  DEFAULT_API_BASE
).replace(/\/+$/, '');

function clean(value: unknown, maxLen: number) {
  return String(value || '').trim().slice(0, maxLen);
}

/** Same-origin check. Parses the origin rather than substring-matching it. */
function isSameOrigin(req: Request): boolean {
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

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Office party reservation endpoint is available. Submit reservations with POST.',
  });
}

export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as ReservationPayload;

    const payload = {
      businessName: clean(body.businessName, 120),
      businessAddress: clean(body.businessAddress, 300),
      businessPhone: clean(body.businessPhone, 40),
      contactName: clean(body.contactName, 120),
      contactPhone: clean(body.contactPhone, 40),
      email: clean(body.email, 160).toLowerCase(),
      specialRequests: clean(body.specialRequests, 2000),
      pickupDate: clean(body.pickupDate, 10),
      pickupTime: clean(body.pickupTime, 5),
      nmiPaymentToken: clean(body.nmiPaymentToken, 200),
      items: (Array.isArray(body.items) ? body.items : []).slice(0, 100).map((item) => ({
        menuItemId: clean(item?.menuItemId, 80),
        quantity: Math.floor(Number(item?.quantity || 0)),
        modifiers: (Array.isArray(item?.modifiers) ? item.modifiers : [])
          .slice(0, 25)
          .map((modifier) => ({ id: clean(modifier?.id, 80) }))
          .filter((modifier) => modifier.id),
        specialInstructions: clean(item?.specialInstructions, 300),
      })),
    };

    if (
      !payload.businessName ||
      !payload.businessAddress ||
      !payload.businessPhone ||
      !payload.contactName ||
      !payload.contactPhone ||
      !payload.email
    ) {
      return NextResponse.json(
        { error: 'Please complete all of the business and contact fields.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!US_PHONE_REGEX.test(payload.businessPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid US business phone number.' },
        { status: 400 }
      );
    }

    if (!US_PHONE_REGEX.test(payload.contactPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid US phone number for the point of contact.' },
        { status: 400 }
      );
    }

    if (!DATE_KEY_REGEX.test(payload.pickupDate)) {
      return NextResponse.json({ error: 'Please choose a pickup date.' }, { status: 400 });
    }

    if (!ALLOWED_SLOTS.includes(payload.pickupTime)) {
      return NextResponse.json(
        { error: 'Pickup time must be 11:00 AM, 12:00 PM, or 1:00 PM.' },
        { status: 400 }
      );
    }

    if (!payload.items.length || payload.items.some((item) => !item.menuItemId || item.quantity < 1)) {
      return NextResponse.json(
        { error: 'Please add at least one item to your order.' },
        { status: 400 }
      );
    }

    if (!payload.nmiPaymentToken) {
      return NextResponse.json(
        { error: 'Payment information is required to confirm your reservation.' },
        { status: 400 }
      );
    }

    const textFields = [
      payload.businessName,
      payload.businessAddress,
      payload.contactName,
      payload.specialRequests,
      ...payload.items.map((item) => item.specialInstructions),
    ].filter(Boolean);
    if (textFields.some((field) => HTML_TAG_REGEX.test(field))) {
      return NextResponse.json({ error: 'Input must not contain HTML tags.' }, { status: 400 });
    }

    const abortController = new AbortController();
    // Longer than the other forms: this round trip includes a card charge.
    const timeoutId = setTimeout(() => abortController.abort(), 30000);

    const response = await fetch(`${API_BASE}/public/office-party-reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abortController.signal,
      cache: 'no-store',
    }).finally(() => clearTimeout(timeoutId));

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error || 'Failed to book your office party.', details: result?.details },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    const timedOut = error?.name === 'AbortError';
    console.error(
      'Office party reservation error:',
      timedOut ? 'Request timed out' : error?.message || 'Unknown error'
    );
    return NextResponse.json(
      {
        error: timedOut
          ? 'That took too long. Please call us at (812) 499-9866 before trying again, so we can check whether your card was charged.'
          : 'Failed to book your office party. Please try again later.',
      },
      { status: 502 }
    );
  }
}
