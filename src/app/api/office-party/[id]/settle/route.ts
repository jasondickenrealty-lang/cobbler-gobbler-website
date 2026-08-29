import { NextResponse } from 'next/server';
import { PARTY_ID_REGEX, clean, forward, isSameOrigin } from '@/lib/officePartyApi';

export const runtime = 'nodejs';

/**
 * Host settles the whole party in one charge.
 *
 * Only reachable with the host token from the reservation's host link. The
 * Cloud Function is what actually verifies it — this proxy only refuses an
 * obviously empty one.
 */

type SettlePayload = {
  hostToken?: string;
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

  const body = (await req.json().catch(() => ({}))) as SettlePayload;

  const payload = {
    hostToken: clean(body.hostToken, 200),
    nmiPaymentToken: clean(body.nmiPaymentToken, 200),
  };

  if (!payload.hostToken) {
    return NextResponse.json({ error: 'Only the host can pay for this party.' }, { status: 403 });
  }

  if (!payload.nmiPaymentToken) {
    return NextResponse.json({ error: 'Payment information is required.' }, { status: 400 });
  }

  return forward(
    `/public/office-party/${encodeURIComponent(id)}/settle`,
    { method: 'POST', body: payload },
    'Failed to pay for the party. Please try again later.'
  );
}
