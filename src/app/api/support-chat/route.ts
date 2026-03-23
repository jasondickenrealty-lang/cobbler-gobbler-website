import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ReqBody = {
  message?: string;
  conversationId?: string;
};

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;
    const message = (body?.message || '').toString().trim();
    const conversationId = (body?.conversationId || '').toString().trim();

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const relayUrl = process.env.SUPPORT_RELAY_URL;
    const relayToken = process.env.SUPPORT_RELAY_TOKEN;

    if (!relayUrl || !relayToken) {
      console.error('Support chat relay is not configured. SUPPORT_RELAY_URL and SUPPORT_RELAY_TOKEN must be set.');
      return NextResponse.json(
        { error: 'Support chat is temporarily unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    const relayEndpoint = `${relayUrl.replace(/\/$/, '')}/chat`;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 15000);

    const res = await fetch(relayEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Relay-Token': relayToken,
      },
      body: JSON.stringify({ message, conversationId }),
      signal: abortController.signal,
    }).finally(() => clearTimeout(timeoutId));

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`Support relay request failed with status ${res.status}:`, data?.error);
      return NextResponse.json(
        { error: 'Support chat is temporarily unavailable. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: data?.reply || '' });
  } catch (error: any) {
    const isAbort = error?.name === 'AbortError';
    console.error('Support chat error:', isAbort ? 'Request timed out' : error?.message || 'Unknown error');

    return NextResponse.json(
      { error: 'Support chat is temporarily unavailable. Please try again later.' },
      { status: 502 }
    );
  }
}
