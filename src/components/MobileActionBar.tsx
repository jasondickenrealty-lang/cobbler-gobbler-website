'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ORDER_ONLINE_URL } from '@/lib/links';
import { isDisplayRoute } from '@/lib/displayRoutes';

/**
 * Mobile-only sticky action bar with the four highest-intent local actions:
 * Order, Call, Directions, Menu. Hidden on lg+ (desktop nav already exposes
 * these). Uses a fixed footer with safe-area padding so it doesn't crowd
 * content, and every control is a real link with an accessible label.
 */
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export default function MobileActionBar() {
  const pathname = usePathname();

  // TV boards and kiosks report narrow viewports, so `lg:hidden` alone would
  // leave this bar sitting across the bottom of the screen.
  if (isDisplayRoute(pathname)) return null;

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-primary/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4 text-center text-[0.62rem] uppercase tracking-[0.12em] text-white">
        <a
          href={ORDER_ONLINE_URL}
          className="flex flex-col items-center gap-1 bg-dugout-red py-2.5 font-semibold transition-colors hover:bg-[#ca4438]"
          aria-label="Order ice cream online for pickup"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 005.6 19H17M17 19a2 2 0 100 4 2 2 0 000-4zM9 19a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Order
        </a>
        <a
          href="tel:+18122053322"
          className="flex flex-col items-center gap-1 py-2.5 transition-colors hover:text-gold"
          aria-label="Call Cobblestone Creamery"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h1.6a1 1 0 01.95.68l1 3a1 1 0 01-.25 1l-1.3 1.3a13 13 0 006 6l1.3-1.3a1 1 0 011-.25l3 1a1 1 0 01.68.95V19a2 2 0 01-2 2h-.5C9.6 21 3 14.4 3 6.5V5z" />
          </svg>
          Call
        </a>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 transition-colors hover:text-gold"
          aria-label="Get directions to 900 Main Street, Evansville"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.3-7-11a7 7 0 1114 0c0 4.7-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Directions
        </a>
        <Link
          href="/menu"
          className="flex flex-col items-center gap-1 py-2.5 transition-colors hover:text-gold"
          aria-label="View the full menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
          </svg>
          Menu
        </Link>
      </div>
    </nav>
  );
}
