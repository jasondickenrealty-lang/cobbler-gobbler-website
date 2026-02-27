import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ReqBody = {
  message?: string;
  conversationId?: string;
};

export async function POST(req: Request) {
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
      return NextResponse.json(
        {
          error:
            'Support chat relay is not configured. Set SUPPORT_RELAY_URL and SUPPORT_RELAY_TOKEN in Vercel env.',
        },
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
      return NextResponse.json(
        { error: data?.error || `Relay request failed (${res.status})` },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: data?.reply || '' });
  } catch (error: any) {
    const isAbort = error?.name === 'AbortError';
    const message = isAbort
      ? 'Support relay timed out'
      : error?.message || 'Support relay request failed';

    return NextResponse.json(
      {
        error: message,
        details: 'Check SUPPORT_RELAY_URL, relay health, SSL cert, and firewall/network rules.',
      },
      { status: 502 }
    );
  }
}
