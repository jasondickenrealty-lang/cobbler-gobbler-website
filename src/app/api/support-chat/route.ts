import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Moona — the support chat widget's backend.
 *
 * This route is a thin, CSRF-guarded proxy. The assistant itself lives in the
 * Cloud Functions API at POST /public/moona, because that is where the Anthropic
 * key and privileged Firestore access already are — the website has neither, so
 * it cannot read the live menu or reach the model on its own.
 *
 * It previously proxied to a self-hosted relay (SUPPORT_RELAY_URL) that shelled
 * out to an agent on a VPS. Those env vars were only ever set on Vercel, so after
 * the move to Firebase App Hosting every customer message failed. There is no
 * relay and no extra secret to configure now: NEXT_PUBLIC_API_BASE is all it needs.
 */

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5401/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');

const MAX_TURNS = 16;
const MAX_CONTENT = 1500;
const REQUEST_TIMEOUT_MS = 25_000;

const OFFLINE_MESSAGE =
  'I am having trouble reaching the shop right now. Please try again in a moment, ' +
  'or give us a call at (812) 499-9866.';

type IncomingMessage = { role?: unknown; content?: unknown };

type ReqBody = {
  messages?: unknown;
  message?: unknown;
  conversationId?: unknown;
};

/**
 * CSRF: the origin's hostname must exactly equal the request host. Parsing the
 * URL (rather than a substring test) stops "cobblestonecreamery.com.evil.tld"
 * from passing the check.
 */
function isSameOrigin(req: Request): boolean {
  const host = (req.headers.get('host') || '').split(':')[0];
  if (!host) return false;

  const rawOrigin = req.headers.get('origin');
  const rawReferer = req.headers.get('referer');
  const candidate = rawOrigin || rawReferer;

  // Same-origin fetch from some browsers omits Origin entirely; allow that.
  if (!candidate) return true;

  try {
    return new URL(candidate).hostname === host;
  } catch {
    return false;
  }
}

function normalizeMessages(body: ReqBody): { role: 'user' | 'assistant'; content: string }[] {
  const raw = Array.isArray(body.messages) ? (body.messages as IncomingMessage[]) : [];

  const cleaned = raw
    .filter(
      (m): m is { role: 'user' | 'assistant'; content: string } =>
        !!m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CONTENT) }))
    .slice(-MAX_TURNS);

  // Back-compat: older widget builds posted a bare { message }.
  if (!cleaned.length && typeof body.message === 'string' && body.message.trim()) {
    return [{ role: 'user', content: body.message.trim().slice(0, MAX_CONTENT) }];
  }

  return cleaned;
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = ((await req.json().catch(() => ({}))) || {}) as ReqBody;
  const messages = normalizeMessages(body);

  if (!messages.length) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }
  // The API requires the exchange to start and end with the customer.
  if (messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  const conversationId = String(body.conversationId ?? '').trim().slice(0, 80);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}/public/moona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, conversationId }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

    if (!res.ok) {
      // 429 is the shared per-IP chat rate limit — worth telling the customer.
      if (res.status === 429) {
        return NextResponse.json(
          { error: 'You are sending messages a bit fast. Give me a second to catch up!' },
          { status: 429 },
        );
      }
      console.error(`Moona upstream failed (${res.status}):`, data?.error || 'no detail');
      return NextResponse.json({ error: data?.error || OFFLINE_MESSAGE }, { status: 502 });
    }

    const reply = String(data?.reply || '').trim();
    if (!reply) {
      return NextResponse.json({ error: OFFLINE_MESSAGE }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    console.error(
      'Moona request failed:',
      isAbort ? 'timed out' : error instanceof Error ? error.message : 'unknown error',
    );
    return NextResponse.json({ error: OFFLINE_MESSAGE }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
