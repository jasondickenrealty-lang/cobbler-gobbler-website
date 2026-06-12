import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/;

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5401/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE
).replace(/\/+$/, '');

function clean(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function containsHtml(value: string): boolean {
  return HTML_TAG_REGEX.test(value);
}

export async function POST(req: Request) {
  try {
    // CSRF: origin hostname must exactly equal the request host.
    // We parse the origin URL to get its hostname so "evilsite.com" can't
    // fool the check by including our hostname as a substring.
    const rawOrigin = req.headers.get('origin');
    const rawReferer = req.headers.get('referer');
    const host = (req.headers.get('host') || '').split(':')[0]; // strip port
    let isSameOrigin = false;
    if (rawOrigin) {
      try {
        isSameOrigin = new URL(rawOrigin).hostname === host;
      } catch { /* malformed origin — deny */ }
    } else if (rawReferer) {
      try {
        isSameOrigin = new URL(rawReferer).hostname === host;
      } catch { /* malformed referer — deny */ }
    }
    if (!isSameOrigin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = clean(body.email, 120).toLowerCase();
    const firstName = clean(body.firstName, 80);
    const source = clean(body.source, 40) || 'website_popup';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (containsHtml(email) || containsHtml(firstName)) {
      return NextResponse.json({ error: 'Invalid characters in input' }, { status: 400 });
    }

    const backendRes = await fetch(`${API_BASE}/public/email-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName, source }),
    });

    const data: unknown = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      const msg = (data as { error?: string })?.error || 'Signup failed';
      return NextResponse.json({ error: msg }, { status: backendRes.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[email-signup] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
