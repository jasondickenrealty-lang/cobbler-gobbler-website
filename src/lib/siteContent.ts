import { cookies, draftMode } from 'next/headers';
import {
  API_BASE,
  FALLBACK_CONTENT,
  PREVIEW_COOKIE,
  REVALIDATE_SECONDS,
  TENANT_ID,
  asStringArray,
  toContent,
  type SiteContent,
} from './siteContentShared';

/**
 * Merchant-editable website content for Cobblestone Creamery.
 *
 * The Website assistant in the admin panel writes to
 * `tenants/cobblestone/site/config`. This module is how that content reaches
 * the public site, so an owner can change hours or put up an announcement
 * without a deploy.
 *
 * WHY IT GOES THROUGH THE API rather than reading Firestore directly:
 * `tenants/*` rules are deliberately closed so a public browser cannot read
 * every merchant's record (see apps/merchant-site/src/lib/firestore.ts), and
 * this app runs on Vercel with only the Firebase client SDK — there is no
 * Google ADC here and no service-account key we want to put in Vercel. The
 * functions API exposes the public-safe subset at /website/public/:tenantId.
 *
 * EVERY FIELD FALLS BACK to the values that were hardcoded in this repo
 * before the config existed. If the API is slow, broken, or the config is
 * missing a field, the site renders exactly what it rendered before —
 * it never renders blank hours or an empty story.
 *
 * SERVER COMPONENTS ONLY. The `next/headers` import above makes this module
 * unusable from a `'use client'` file, so the types, fallbacks, formatting
 * and parsing live in ./siteContentShared and are re-exported below. Client
 * components must import from that module directly — importing them from
 * here pulls `next/headers` into the browser bundle and fails the build.
 */

export * from './siteContentShared';

/**
 * Fetch the published content every visitor sees. Cached on the same 60s beat
 * the assistant promises for a publish, and never blocking: if the API is slow
 * or broken the caller falls back to the hardcoded content.
 */
async function fetchLive(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${API_BASE}/website/public/${TENANT_ID}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { configured?: boolean; site?: Record<string, unknown> };
    if (body?.configured && body.site && typeof body.site === 'object') return body.site;
    return null;
  } catch {
    // Network/API trouble must never take the site's hours down with it.
    return null;
  }
}

/**
 * Fetch the owner's UNPUBLISHED draft. Only ever called when Draft Mode is on,
 * which only happens after /api/preview verified their token — so reading the
 * cookie here cannot turn a normal visit into a dynamic render.
 */
async function fetchDraft(): Promise<{
  raw: Record<string, unknown> | null;
  pending: string[];
} | null> {
  const token = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!token) return null;

  try {
    // Header, not a query string: a token in a URL ends up in request logs.
    const res = await fetch(`${API_BASE}/website/preview/${TENANT_ID}`, {
      cache: 'no-store',
      headers: { 'x-preview-token': token },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      configured?: boolean;
      site?: Record<string, unknown>;
      pendingChanges?: unknown;
    };
    if (!body?.configured || !body.site || typeof body.site !== 'object') return null;
    return {
      raw: body.site,
      pending: asStringArray(body.pendingChanges, 12),
    };
  } catch {
    return null;
  }
}

/**
 * Read the merchant-editable content. Never throws and never returns empty
 * sections — anything missing falls back to the previously hardcoded values.
 *
 * In Draft Mode (the owner opened their private preview link) this returns the
 * unpublished draft instead, so they see exactly what publishing would do.
 * `draftMode()` is checked before `cookies()` on purpose: for an ordinary
 * visitor nothing dynamic is ever read, and these pages stay statically
 * rendered and CDN-cached exactly as they were.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    const draft = await fetchDraft();
    if (draft?.raw) {
      return toContent(draft.raw, { isPreview: true, pendingChanges: draft.pending });
    }
    // Token revoked or the backend is down: show the live site rather than a
    // blank one, and drop the preview badge so nobody trusts a stale draft.
  }

  const raw = await fetchLive();
  if (!raw) return FALLBACK_CONTENT;
  return toContent(raw, { isPreview: false, pendingChanges: [] });
}
