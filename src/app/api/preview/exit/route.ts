/**
 * Preview mode — leave. Puts this browser back on the published site.
 */

import { draftMode, cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { PREVIEW_COOKIE } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_COOKIE);
  return NextResponse.redirect(new URL('/', request.url));
}
