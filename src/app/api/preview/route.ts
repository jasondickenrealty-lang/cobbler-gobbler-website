/**
 * Preview mode — enter.
 *
 * The owner edits their site by chatting with the Website assistant in the
 * admin panel. Those edits are saved as an unpublished draft; this is the door
 * that lets them SEE the draft on the real site before anything goes public.
 *
 *   /api/preview?token=<their private token>
 *
 * The token is never trusted here. It is handed to the backend, which compares
 * it in constant time against the token stored for this tenant. Only if that
 * succeeds do we turn on Next's Draft Mode and remember the token in an
 * httpOnly cookie, so the rest of the site can fetch draft content for this
 * browser and this browser only.
 *
 * Nothing about the live site changes. Every other visitor keeps getting the
 * published, cached, statically-rendered pages.
 */

import { draftMode, cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { API_BASE, PREVIEW_COOKIE, TENANT_ID } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

/**
 * Only same-origin paths, so ?redirect= can never bounce someone off-site.
 *
 * Checking the resolved origin rather than the string shape is what makes this
 * safe: "/\\evil.com" and "/%2F%2Fevil.com" both look like paths and both
 * resolve to another origin, and a preview link is meant to be forwarded, so
 * an open redirect here would be an open redirect on the merchant's own
 * branded domain.
 */
function safeRedirect(value: string | null, base: URL): string {
  if (!value || !value.startsWith('/')) return '/';
  try {
    const resolved = new URL(value, base);
    return resolved.origin === base.origin ? resolved.pathname + resolved.search : '/';
  } catch {
    return '/';
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const target = safeRedirect(request.nextUrl.searchParams.get('redirect'), request.nextUrl);

  if (!token || token.length > 256) {
    return new NextResponse('This preview link is not valid.', {
      status: 400,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  let ok = false;
  try {
    const res = await fetch(`${API_BASE}/website/preview/${TENANT_ID}`, {
      cache: 'no-store',
      headers: { 'x-preview-token': token },
    });
    ok = res.ok;
  } catch {
    ok = false;
  }

  if (!ok) {
    return new NextResponse(
      'This preview link is not valid any more. Ask for a fresh one in the Website page of your admin panel.',
      { status: 403, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    );
  }

  (await draftMode()).enable();

  // Next's draft cookie says "show drafts"; this one says which draft, and is
  // what the server uses to authenticate the draft fetch on every page.
  (await cookies()).set({
    name: PREVIEW_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.redirect(new URL(target, request.url));
}
