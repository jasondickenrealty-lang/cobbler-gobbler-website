'use client';

/**
 * Carries the merchant-editable site content (hours, announcements, hero,
 * story) from the server layout down to components that render in a client
 * tree — the footer especially, which appears on client pages like /location
 * where the hours matter most.
 *
 * The value is fetched once per render in the root layout, so every page shows
 * the same hours. Anything rendered outside the provider falls back to the
 * previously hardcoded content rather than rendering blank.
 */

import { createContext, useContext } from 'react';
import { FALLBACK_CONTENT, type SiteContent } from '@/lib/siteContent';

const SiteContentContext = createContext<SiteContent>(FALLBACK_CONTENT);

export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
