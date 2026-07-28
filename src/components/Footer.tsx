import Link from 'next/link';
import { FREE_GAME_PLAY_URL, ORDER_ONLINE_URL, WHOLESALE_URL } from '@/lib/links';

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
  { href: '/free-kids-scoop', label: 'Free Kids Scoop' },
  { href: '/fundraising', label: 'Fundraising' },
  { href: WHOLESALE_URL, label: 'Wholesale', external: true },
  { href: FREE_GAME_PLAY_URL, label: 'Game Play', external: true },
  { href: '/location', label: 'Visit Us' },
];

const hours = [
  'Monday - Thursday: 11:00 AM - 2:00 PM, 4:00 PM - 9:00 PM',
  'Friday: 11:00 AM - 2:00 PM, 4:00 PM - 10:00 PM',
  'Saturday: 11:00 AM - 10:00 PM',
  'Sunday: 12:00 PM - 6:00 PM',
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-gold bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="max-w-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.34em] text-gold">Cobblestone Creamery</p>
            <h3 className="font-serif text-4xl uppercase tracking-[0.08em] text-chalk">
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
                className="rounded-full bg-dugout-red px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ca4438]"
              >
                Order Online
              </a>
              <Link
                href="/location"
                className="rounded-full border border-white/[0.18] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-gold/60 hover:text-gold"
              >
                Visit Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Quick Links</h4>
            <div className="mt-5 grid gap-3">
              {quickLinks.map((link) =>
                link.external ? (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className="text-sm uppercase tracking-[0.16em] text-white/[0.72] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm uppercase tracking-[0.16em] text-white/[0.72] transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Visit The Shop</h4>
            <div className="mt-5 rounded-[1.75rem] border border-white/[0.12] bg-white/[0.06] p-6">
              <address className="not-italic space-y-3 text-sm uppercase tracking-[0.14em] text-white/[0.72]">
                <p className="text-white">900 Main Street</p>
                <p>Inside Main Street Food &amp; Beverage</p>
                <p>Evansville, Indiana 47708</p>
                <p>
                  <a href="tel:+18124999866" className="transition-colors hover:text-gold">
                    (812) 499-9866
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@cobblestonecreamery.com"
                    className="transition-colors hover:text-gold"
                  >
                    info@cobblestonecreamery.com
                  </a>
                </p>
              </address>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Hours</p>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  {hours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em] text-white/[0.45] md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Cobblestone Creamery. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-white/[0.72]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/[0.72]">
              Terms &amp; Conditions
            </Link>
            <a
              href="https://www.facebook.com/profile.php?id=61588303764359"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white/[0.72]"
            >
              Facebook
            </a>
            <Link href="/employee/login" className="transition-colors hover:text-white/[0.72]">
              Employee Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
