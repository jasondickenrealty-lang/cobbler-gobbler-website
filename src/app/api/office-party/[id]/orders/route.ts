import { NextResponse } from 'next/server';
import {
  EMAIL_REGEX,
  HTML_TAG_REGEX,
  PARTY_ID_REGEX,
  clean,
  cleanItems,
  forward,
  isSameOrigin,
} from '@/lib/officePartyApi';

export const runtime = 'nodejs';

/**
 * Add one guest's order to a party.
 *
 * A card token is required only when the party bills individually, which the
 * Cloud Function knows and this proxy does not — so a missing token is left
 * for the function to reject rather than guessed at here.
 */

type GuestOrderPayload = {
  guestName?: string;
  guestEmail?: string;
  items?: unknown;
  nmiPaymentToken?: string;
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (!PARTY_ID_REGEX.test(id)) {
    return NextResponse.json({ error: 'That office party could not be found.' }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as GuestOrderPayload;

  const payload = {
    guestName: clean(body.guestName, 120),
    guestEmail: clean(body.guestEmail, 160).toLowerCase(),
    nmiPaymentToken: clean(body.nmiPaymentToken, 200),
    items: cleanItems(body.items),
  };

  if (!payload.guestName) {
    return NextResponse.json(
      { error: 'Please enter your name so we know whose order this is.' },
      { status: 400 }
    );
  }

  if (HTML_TAG_REGEX.test(payload.guestName)) {
    return NextResponse.json({ error: 'Input must not contain HTML tags.' }, { status: 400 });
  }

  if (payload.guestEmail && !EMAIL_REGEX.test(payload.guestEmail)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!payload.items.length || payload.items.some((item) => !item.menuItemId || item.quantity < 1)) {
    return NextResponse.json(
      { error: 'Please add at least one item to your order.' },
      { status: 400 }
    );
  }

  if (payload.items.some((item) => HTML_TAG_REGEX.test(item.specialInstructions))) {
    return NextResponse.json({ error: 'Input must not contain HTML tags.' }, { status: 400 });
  }

  return forward(
    `/public/office-party/${encodeURIComponent(id)}/orders`,
    { method: 'POST', body: payload },
    'Failed to add your order. Please try again later.'
  );
}
