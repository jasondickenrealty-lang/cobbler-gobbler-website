import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Initiates the Facebook OAuth flow.
 * Redirects the user to Facebook's authorization dialog.
 *
 * Visit: https://cobblestonecreamery.com/auth/facebook
 */
export async function GET(req: Request) {
  const appId = process.env.FACEBOOK_APP_ID;
  const requestOrigin = new URL(req.url).origin;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${requestOrigin}/auth/facebook/callback`;

  if (!appId) {
    return NextResponse.json(
      { error: 'Facebook app credentials not configured. Set FACEBOOK_APP_ID in Vercel env vars.' },
      { status: 500 },
    );
  }

  const scopes = [
    'pages_show_list',
  ].join(',');

  const fbUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth');
  fbUrl.searchParams.set('client_id', appId);
  fbUrl.searchParams.set('redirect_uri', redirectUri);
  fbUrl.searchParams.set('scope', scopes);
  fbUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(fbUrl.toString());
}
