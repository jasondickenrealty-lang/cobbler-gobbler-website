/**
 * One job: make sure a page rendered from an unpublished draft can never be
 * indexed, whatever else happens.
 *
 * Preview needs an httpOnly cookie that only /api/preview can set, so a
 * crawler cannot reach draft content in the first place. This is the second
 * lock on that door — cheap, and it means a forwarded preview link can never
 * put unpublished wording into search results.
 *
 * Reading cookies in middleware does NOT affect static generation: normal
 * visitors keep getting the prerendered, cached pages.
 */

import { NextResponse, type NextRequest } from 'next/server';

const PREVIEW_COOKIE = 'cbs_preview_token';
const DRAFT_COOKIE = '__prerender_bypass';

export function middleware(request: NextRequest) {
  const inPreview =
    request.cookies.has(PREVIEW_COOKIE) || request.cookies.has(DRAFT_COOKIE);

  const res = NextResponse.next();
  if (inPreview) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.headers.set('Cache-Control', 'private, no-store, max-age=0');
  }
  return res;
}

export const config = {
  // Skip Next's own assets and the image optimizer — nothing there to protect.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
