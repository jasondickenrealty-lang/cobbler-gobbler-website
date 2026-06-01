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
  { href: WHOLESALE_URL, label: 'Wholesale', external: true },
  { href: '/about', label: 'Our Story' },
  { href: '/fundraising', label: 'Fundraising' },
  { href: '/join-our-team', label: 'Join Our Team' },
  { href: '/location', label: 'Visit Us' },
];

const utilityLinks: NavLink[] = [
  { href: '/free-kids-scoop', label: 'Free Kids Scoop' },
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-white/[0.72]">
          <p>Downtown Evansville, Indiana</p>
          <div className="flex items-center gap-4 text-white/[0.78]">
            <a href="tel:+18122053322" className="transition-colors hover:text-gold">
              (812) 205-3322
            </a>
            {utilityLinks.map((link) =>
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex min-h-[84px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-4 text-white transition-transform duration-200 hover:translate-y-[-1px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/70 bg-white/10 text-2xl text-gold">
              CC
            </div>
            <div>
              <p className="font-serif text-4xl leading-none tracking-[0.14em] text-chalk">
                Cobblestone
              </p>
              <p className="-mt-1 text-[0.7rem] uppercase tracking-[0.34em] text-gold/90">
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
              aria-label="Toggle menu"
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
        <div className="border-t border-white/10 bg-scoreboard/95 px-6 pb-6 pt-4 lg:hidden">
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
