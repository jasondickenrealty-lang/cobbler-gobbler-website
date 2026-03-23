import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type JobApplicationPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  availability?: string;
  startDate?: string;
  experience?: string;
  whyJoin?: string;
  additionalInfo?: string;
};

const ALLOWED_POSITIONS = [
  'Team Member',
  'Shift Leader',
  'Assistant Manager',
  'Manager',
  'Kitchen Staff',
  'Barista',
  'Cashier',
  'Other',
];

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const HTML_TAG_REGEX = /<[^>]*>/;

function containsHtml(value: string): boolean {
  return HTML_TAG_REGEX.test(value);
}

const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5401/cobblestone-pos/us-central1/api'
    : 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';

const API_BASE = (process.env.JOB_APPLICATION_API_BASE || process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');

function clean(value: unknown, maxLen: number) {
  return String(value || '').trim().slice(0, maxLen);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Job application endpoint is available. Submit applications with POST.',
  });
}

export async function POST(req: Request) {
  try {
    // CSRF protection: validate that the request origin matches the host
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const host = req.headers.get('host');
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!origin && referer && host && !referer.includes(host)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as JobApplicationPayload;

    const payload = {
      firstName: clean(body.firstName, 80),
      lastName: clean(body.lastName, 80),
      email: clean(body.email, 120).toLowerCase(),
      phone: clean(body.phone, 40),
      position: clean(body.position, 120),
      availability: clean(body.availability, 800),
      startDate: clean(body.startDate, 40),
      experience: clean(body.experience, 3000),
      whyJoin: clean(body.whyJoin, 3000),
      additionalInfo: clean(body.additionalInfo, 3000),
    };

    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.email ||
      !payload.phone ||
      !payload.position ||
      !payload.availability ||
      !payload.whyJoin
    ) {
      return NextResponse.json(
        { error: 'Please complete all required fields.' },
        { status: 400 }
      );
    }

    // Validate email with a more robust regex
    if (!EMAIL_REGEX.test(payload.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Validate US phone number format
    if (!US_PHONE_REGEX.test(payload.phone)) {
      return NextResponse.json({ error: 'Please enter a valid US phone number.' }, { status: 400 });
    }

    // Validate position against whitelist
    if (!ALLOWED_POSITIONS.some((p) => p.toLowerCase() === payload.position.toLowerCase())) {
      return NextResponse.json({ error: 'Please select a valid position.' }, { status: 400 });
    }

    // Check required text fields for HTML tags (basic XSS prevention)
    const textFields = [
      payload.firstName, payload.lastName, payload.availability,
      payload.experience, payload.whyJoin, payload.additionalInfo,
    ].filter(Boolean);
    if (textFields.some((field) => containsHtml(field))) {
      return NextResponse.json({ error: 'Input must not contain HTML tags.' }, { status: 400 });
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 15000);

    const response = await fetch(`${API_BASE}/public/job-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abortController.signal,
      cache: 'no-store',
    }).finally(() => clearTimeout(timeoutId));

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error || 'Failed to submit application.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, id: result?.id || null });
  } catch (error: any) {
    console.error('Job application error:', error?.name === 'AbortError' ? 'Request timed out' : error?.message || 'Unknown error');
    return NextResponse.json({ error: 'Failed to submit application. Please try again later.' }, { status: 502 });
  }
}
