import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';

const ALLOWED_ORIGINS = [
  'https://cobblestonecreamery.com',
  'https://www.cobblestonecreamery.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

/** Strip HTML tags and limit length for safe URL inclusion */
function sanitizePageName(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-.,'&()]/g, '')
    .trim()
    .slice(0, 100);
}

const FB_GRAPH = 'https://graph.facebook.com/v21.0';
const REQUIRED_SCOPES = [
  'pages_show_list',
];

/**
 * Facebook OAuth callback handler.
 * 1. Exchanges the auth code for a short-lived user token
 * 2. Exchanges that for a long-lived user token (60 days)
 * 3. Fetches the list of pages the user manages
 * 4. Gets a long-lived page access token
 * 5. Stores everything in Firestore settings/facebookPageAuth
 */
export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const { searchParams } = requestUrl;
  const requestOrigin = requestUrl.origin;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    return NextResponse.json(
      { error: 'Facebook auth denied', detail: errorDescription || error },
      { status: 400 },
    );
  }

  if (!code) {
    const restartUrl = new URL('/auth/facebook', requestOrigin);
    return NextResponse.redirect(restartUrl.toString());
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${requestOrigin}/auth/facebook/callback`;

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'Facebook app credentials not configured on server' },
      { status: 500 },
    );
  }

  try {
    // Step 1: Exchange code for short-lived user token
    const tokenUrl = new URL(`${FB_GRAPH}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: 'Failed to exchange code', detail: tokenData.error.message },
        { status: 400 },
      );
    }

    const shortLivedToken: string = tokenData.access_token;

    // Step 2: Exchange for long-lived user token (60 days)
    const longTokenUrl = new URL(`${FB_GRAPH}/oauth/access_token`);
    longTokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longTokenUrl.searchParams.set('client_id', appId);
    longTokenUrl.searchParams.set('client_secret', appSecret);
    longTokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

    const longTokenRes = await fetch(longTokenUrl.toString());
    const longTokenData = await longTokenRes.json();

    if (longTokenData.error) {
      return NextResponse.json(
        { error: 'Failed to get long-lived token', detail: longTokenData.error.message },
        { status: 400 },
      );
    }

    const longLivedUserToken: string = longTokenData.access_token;
    const expiresIn: number = longTokenData.expires_in || 5184000; // ~60 days

    // Step 3: Inspect granted permissions for diagnostics
    const permissionsRes = await fetch(`${FB_GRAPH}/me/permissions?access_token=${longLivedUserToken}`);
    const permissionsData = await permissionsRes.json();
    const grantedPermissions: string[] = Array.isArray(permissionsData?.data)
      ? permissionsData.data
        .filter((perm: { permission?: string; status?: string }) => perm?.status === 'granted' && typeof perm?.permission === 'string')
        .map((perm: { permission: string }) => perm.permission)
      : [];
    const missingPermissions = REQUIRED_SCOPES.filter((scope) => !grantedPermissions.includes(scope));

    // Step 4: Get user info
    const meRes = await fetch(`${FB_GRAPH}/me?fields=id,name&access_token=${longLivedUserToken}`);
    const meData = await meRes.json();

    // Step 5: Get pages the user manages (these tokens don't expire)
    const pagesRes = await fetch(
      `${FB_GRAPH}/me/accounts?fields=id,name,access_token,category&access_token=${longLivedUserToken}`,
    );
    const pagesData = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        {
          error: 'No Facebook pages found for this account.',
          detail: 'Your Facebook login succeeded, but Meta returned zero pages from /me/accounts.',
          authenticatedUser: {
            userId: meData?.id || null,
            userName: meData?.name || null,
          },
          missingPermissions,
          grantedPermissions,
          nextSteps: [
            'Re-run /auth/facebook and accept all requested permissions.',
            'Confirm this Facebook user has Page access (Admin/Full Control) to at least one Page.',
            'If the Meta app is in Development mode, add this user as an App Admin/Developer/Tester.',
          ],
        },
        { status: 400 },
      );
    }

    // Validate redirect origin
    if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 },
      );
    }

    // Step 6: Store in Firestore
    const pages = pagesData.data.map((page: { id: string; name: string; access_token: string; category: string }) => ({
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token,
      category: page.category || null,
    }));

    // Use the first page by default
    const primaryPage = pages[0];

    await setDoc(doc(db, 'settings', 'facebookPageAuth'), {
      userId: meData.id || null,
      userName: meData.name || null,
      userAccessToken: longLivedUserToken,
      userTokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      pages,
      primaryPageId: primaryPage.pageId,
      primaryPageName: primaryPage.pageName,
      primaryPageAccessToken: primaryPage.pageAccessToken,
      scopes: REQUIRED_SCOPES.join(','),
      grantedPermissions,
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const successUrl = new URL('/auth/facebook/success', requestOrigin);
    successUrl.searchParams.set('ok', '1');
    successUrl.searchParams.set('pageId', primaryPage.pageId);
    successUrl.searchParams.set('pageName', sanitizePageName(primaryPage.pageName));
    successUrl.searchParams.set('pagesCount', String(pages.length));
    return NextResponse.redirect(successUrl.toString());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Facebook OAuth failed', detail: message },
      { status: 500 },
    );
  }
}
