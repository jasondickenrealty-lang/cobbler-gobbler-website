'use client';

/**
 * Announcement strip shown above the page.
 *
 * Driven entirely by the announcements an owner sets in the admin panel's
 * Website assistant. When there are none, this renders nothing at all, so the
 * page looks exactly as it did before the banner existed.
 */

import { usePathname } from 'next/navigation';
import { isDisplayRoute } from '@/lib/displayRoutes';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const { announcements } = useSiteContent();

  if (!announcements.length) return null;

  // Off on unattended screens (TV boards, in-store kiosks), same as the other
  // visitor-facing chrome — it would eat menu space nobody asked it to.
  if (isDisplayRoute(pathname)) return null;

  return (
    <div className="border-b border-gold/30 bg-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2.5 text-center text-sm sm:px-6">
        {announcements.map((line) => (
          <p key={line} className="leading-6 text-white/90">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
