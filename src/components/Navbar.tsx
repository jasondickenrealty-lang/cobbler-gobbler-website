'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FREE_GAME_PLAY_URL, ORDER_ONLINE_URL } from '@/lib/links';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Monthly Flavors' },
  { href: '/free-kids-scoop', label: 'FREE KIDS SCOOP' },
  { href: FREE_GAME_PLAY_URL, label: 'FREE GAME PLAY', external: true },
  { href: '/about', label: 'Our Story' },
  { href: '/location', label: 'Visit Us' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl tracking-wide mr-8">
            Cobblestone Creamery
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-sm tracking-wide uppercase transition-colors hover:text-gold text-white/90"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide uppercase transition-colors hover:text-gold ${
                    pathname === link.href ? 'text-gold' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <a
              href={ORDER_ONLINE_URL}
              className="hidden md:inline-block bg-gold text-white text-sm font-medium tracking-wide px-5 py-2 rounded transition-colors hover:bg-gold/90"
            >
              Order Online
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-6 pb-4">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm tracking-wide uppercase transition-colors hover:text-gold text-white/80"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm tracking-wide uppercase transition-colors hover:text-gold ${
                  pathname === link.href ? 'text-gold' : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
          <a
            href={ORDER_ONLINE_URL}
            onClick={() => setMobileOpen(false)}
            className="block mt-2 bg-gold text-white text-sm font-medium tracking-wide text-center px-5 py-2.5 rounded transition-colors hover:bg-gold/90"
          >
            Order Online
          </a>
        </div>
      )}
    </nav>
  );
}
