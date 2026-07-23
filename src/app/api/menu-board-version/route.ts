import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Identifies the running deployment so unattended TV boards can notice when a
 * new version ships and reload themselves. TV browsers cache aggressively and
 * ignore revalidation headers, so without this a board can sit on a stale build
 * indefinitely with nobody in the room to refresh it.
 */
export async function GET() {
  const version =
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.K_REVISION || // Firebase App Hosting / Cloud Run
    'dev';

  return NextResponse.json(
    { version },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } },
  );
}
