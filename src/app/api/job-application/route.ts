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

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!emailIsValid) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
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
    const message =
      error?.name === 'AbortError'
        ? 'Application request timed out.'
        : error?.message || 'Failed to submit application.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
