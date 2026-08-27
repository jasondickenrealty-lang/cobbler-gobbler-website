'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FREE_GAME_PLAY_URL, ORDER_ONLINE_URL, WHOLESALE_URL } from '@/lib/links';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/current-flavors', label: 'Flavors' },
  { href: '/about', label: 'Our Story' },
  { href: '/join-our-team', label: 'Join Our Team' },
  { href: '/location', label: 'Visit Us' },
];

const utilityLinks: NavLink[] = [
  { href: WHOLESALE_URL, label: 'Wholesale', external: true },
  { href: FREE_GAME_PLAY_URL, label: 'Game Play', external: true },
];

function isCurrentPath(pathname: string, href: string) {
  return pathname === href;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-gold bg-primary text-white shadow-[0_14px_30px_rgba(11,22,40,0.16)]">
      <div className="border-b border-white/10 bg-dark/[0.45]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-[0.6rem] uppercase tracking-[0.14em] text-white/[0.72] sm:px-6 sm:text-[0.72rem] sm:tracking-[0.28em]">
          <p>Downtown Evansville, Indiana</p>
          {/* The three utility links push this strip to 4-5 wrapped rows on a
              360px phone and eat the whole above-the-fold. They all live in
              the hamburger menu below, so on mobile only the phone number —
              the one tap-to-act item — stays here. */}
          <div className="flex items-center gap-4 text-white/[0.78]">
            <a href="tel:+18124999866" className="py-1 transition-colors hover:text-gold">
              (812) 499-9866
            </a>
            {utilityLinks.map((link) =>
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="hidden py-1 transition-colors hover:text-gold md:inline-block"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hidden py-1 transition-colors hover:text-gold md:inline-block"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* min-w-0 on the brand link so it can shrink instead of shoving the
            hamburger off-screen at 360px. */}
        <div className="flex min-h-[72px] items-center justify-between gap-3 sm:min-h-[84px] sm:gap-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 text-white transition-transform duration-200 hover:translate-y-[-1px] sm:gap-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold/70 bg-white/10 text-xl text-gold sm:h-14 sm:w-14 sm:text-2xl">
              CC
            </div>
            <div className="min-w-0">
              <p className="font-serif text-[1.75rem] leading-none tracking-[0.08em] text-chalk sm:text-4xl sm:tracking-[0.14em]">
                Cobblestone
              </p>
              <p className="-mt-1 text-[0.6rem] uppercase tracking-[0.24em] text-gold/90 sm:text-[0.7rem] sm:tracking-[0.34em]">
                Creamery
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-sm uppercase tracking-[0.22em] text-white/[0.82] transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm uppercase tracking-[0.22em] transition-colors hover:text-gold ${
                    isCurrentPath(pathname, link.href)
                      ? 'text-gold'
                      : 'text-white/[0.82]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={ORDER_ONLINE_URL}
              className="hidden rounded-full border border-gold bg-dugout-red px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ca4438] md:inline-block"
            >
              Order Online
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        // max-h + scroll so the 10-item menu is still fully reachable on a
        // short screen (landscape phone / small Android) instead of running
        // off the bottom with no way to scroll it.
        <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-scoreboard/95 px-4 pb-6 pt-4 sm:px-6 lg:hidden">
          <div className="grid gap-3">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/[0.82] transition-colors hover:border-gold/60 hover:text-gold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm uppercase tracking-[0.18em] transition-colors ${
                    isCurrentPath(pathname, link.href)
                      ? 'border-gold/70 bg-gold/10 text-gold'
                      : 'border-white/10 bg-white/5 text-white/[0.82] hover:border-gold/60 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            {utilityLinks.map((link) =>
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/[0.82] transition-colors hover:border-gold/60 hover:text-gold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm uppercase tracking-[0.18em] transition-colors ${
                    isCurrentPath(pathname, link.href)
                      ? 'border-gold/70 bg-gold/10 text-gold'
                      : 'border-white/10 bg-white/5 text-white/[0.82] hover:border-gold/60 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            <a
              href={ORDER_ONLINE_URL}
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-dugout-red px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ca4438]"
            >
              Order Online
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
