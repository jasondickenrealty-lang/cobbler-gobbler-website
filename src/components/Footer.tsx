'use client';

import Link from 'next/link';
import { FREE_GAME_PLAY_URL, ORDER_ONLINE_URL, WHOLESALE_URL } from '@/lib/links';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { hoursLines } from '@/lib/siteContent';

const quickLinks = [
  { href: '/menu', label: 'Menu' },
  { href: ORDER_ONLINE_URL, label: 'Order Online', external: true },
  { href: '/current-flavors', label: 'Current Flavors' },
  { href: '/milkshakes-evansville', label: 'Signature Milkshakes' },
  { href: '/waffle-cones-evansville', label: 'Waffle Cones' },
  { href: '/dessert-downtown-evansville', label: 'Dessert Downtown' },
  { href: '/ice-cream-catering-evansville', label: 'Catering' },
  { href: '/ice-cream-fundraising-evansville', label: 'Fundraising Nights' },
  { href: '/about', label: 'Our Story' },
  { href: '/fundraising', label: 'Fundraising' },
  { href: WHOLESALE_URL, label: 'Wholesale', external: true },
  { href: FREE_GAME_PLAY_URL, label: 'Game Play', external: true },
  { href: '/location', label: 'Visit Us' },
];

export default function Footer() {
  // Hours come from the config the owner edits in the admin panel; the
  // provider falls back to the previously hardcoded week if it is unreachable.
  const { hours, hoursNote } = useSiteContent();
  const lines = hoursLines(hours);

  return (
    <footer className="mt-auto border-t-4 border-gold bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="max-w-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold sm:text-sm sm:tracking-[0.34em]">Cobblestone Creamery</p>
            <h3 className="font-serif text-3xl uppercase tracking-[0.08em] text-chalk sm:text-4xl">
              Dessert With
              <span className="block text-gold">Some Ballpark Energy</span>
            </h3>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/[0.72]">
              Fresh waffle cones, stacked milkshakes, cobblers, and downtown Evansville
              scoop-shop energy. Built for families, post-dinner dessert runs, and
              anyone who wants the place to feel as fun as the treat.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-flex min-h-[44px] items-center rounded-full bg-dugout-red px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ca4438]"
              >
                Order Online
              </a>
              <Link
                href="/location"
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/[0.18] bg-white/[0.06] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-gold/60 hover:text-gold"
              >
                Visit Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm sm:tracking-[0.3em]">Quick Links</h4>
            {/* py-2.5 turns each link into a ~44px tap target; gap drops to 0 so the
                 column height stays the same as before. */}
            <div className="mt-3 grid gap-0">
              {quickLinks.map((link) =>
                link.external ? (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className="block py-2.5 text-sm uppercase tracking-[0.16em] text-white/[0.72] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2.5 text-sm uppercase tracking-[0.16em] text-white/[0.72] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm sm:tracking-[0.3em]">Visit The Shop</h4>
            <div className="mt-5 rounded-[1.75rem] border border-white/[0.12] bg-white/[0.06] p-5 sm:p-6">
              <address className="not-italic space-y-3 text-sm uppercase tracking-[0.14em] text-white/[0.72]">
                <p className="text-white">900 Main Street</p>
                <p>Inside Main Street Food &amp; Beverage</p>
                <p>Evansville, Indiana 47708</p>
                <p>
                  <a href="tel:+18124999866" className="inline-flex min-h-[44px] items-center transition-colors hover:text-gold">
                    (812) 499-9866
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@cobblestonecreamery.com"
                    /* normal-case + no tracking + break-all: uppercased with
                       0.14em tracking this 28-char address measured ~310px
                       against a 262px card and scrolled the whole page
                       sideways on a 360px phone. */
                    className="inline-flex min-h-[44px] items-center break-all normal-case tracking-normal transition-colors hover:text-gold"
                  >
                    info@cobblestonecreamery.com
                  </a>
                </p>
              </address>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Hours</p>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  {lines.map((line) => (
                    <p key={line.label}>
                      {line.label}: {line.value}
                    </p>
                  ))}
                  {hoursNote && <p className="text-white/[0.55]">{hoursNote}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em] text-white/[0.45] md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Cobblestone Creamery. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0">
            <Link href="/privacy" className="inline-flex min-h-[44px] items-center transition-colors hover:text-white/[0.72]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-[44px] items-center transition-colors hover:text-white/[0.72]">
              Terms &amp; Conditions
            </Link>
            <a
              href="https://www.facebook.com/profile.php?id=61588303764359"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center transition-colors hover:text-white/[0.72]"
            >
              Facebook
            </a>
            <Link href="/employee/login" className="inline-flex min-h-[44px] items-center transition-colors hover:text-white/[0.72]">
              Employee Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
