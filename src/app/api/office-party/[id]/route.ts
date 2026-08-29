import { NextResponse } from 'next/server';
import { PARTY_ID_REGEX, clean, forward, isSameOrigin } from '@/lib/officePartyApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Read one office party.
 *
 * The party id is the share link's secret, so holding it is enough to see the
 * guest view. A ?hostToken= that matches unlocks the host's extra detail; the
 * Cloud Function decides that, not this proxy.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (!PARTY_ID_REGEX.test(id)) {
    return NextResponse.json({ error: 'That office party could not be found.' }, { status: 404 });
  }

  const hostToken = clean(new URL(req.url).searchParams.get('hostToken'), 200);
  const query = hostToken ? `?hostToken=${encodeURIComponent(hostToken)}` : '';

  return forward(
    `/public/office-party/${encodeURIComponent(id)}${query}`,
    { method: 'GET' },
    'Failed to load the office party.'
  );
}
