import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfficePartyBooking from '@/components/office-party/OfficePartyBooking';
import { getMenuData } from '@/lib/menu-data';
import { MIN_SUBTOTAL_CENTS, LEAD_TIME_MINUTES } from '@/lib/partySlots';

const SITE_URL = 'https://cobblestonecreamery.com';

// The menu is fetched per request so an item pulled from the POS cannot be
// ordered from a stale cached page.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book an Office Party | Cobblestone Creamery Evansville',
  description:
    'Reserve ice cream for your Evansville office party online. Pick any items off our menu, choose an 11am, 12pm, or 1pm pickup, and pay in full. $75 minimum.',
  alternates: {
    canonical: `${SITE_URL}/office-party-reservation`,
  },
  openGraph: {
    title: 'Book an Office Party | Cobblestone Creamery',
    description:
      'Reserve ice cream for your Evansville office party online. Any menu item, 11am/12pm/1pm pickup, $75 minimum.',
    url: `${SITE_URL}/office-party-reservation`,
    images: [
      {
        url: '/menu-cones/strawberry.png',
        width: 800,
        height: 800,
        alt: 'Ice cream for an Evansville office party from Cobblestone Creamery',
      },
    ],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Ice Cream Catering in Evansville, IN',
      item: `${SITE_URL}/ice-cream-catering-evansville`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Book an Office Party',
      item: `${SITE_URL}/office-party-reservation`,
    },
  ],
};

const MINIMUM_LABEL = `$${(MIN_SUBTOTAL_CENTS / 100).toFixed(0)}`;

export default async function OfficePartyReservationPage() {
  const menu = await getMenuData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-5">
              Book an Office Party
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Pick anything off our menu, choose a pickup time, and pay online. We will have
              it boxed up and ready at 900 Main Street.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3 text-sm">
              <li className="rounded-lg bg-white/70 px-4 py-3 text-dark/70">
                <span className="block font-bold text-primary">{MINIMUM_LABEL} minimum</span>
                before tax
              </li>
              <li className="rounded-lg bg-white/70 px-4 py-3 text-dark/70">
                <span className="block font-bold text-primary">11am · 12pm · 1pm</span>
                pickup times
              </li>
              <li className="rounded-lg bg-white/70 px-4 py-3 text-dark/70">
                <span className="block font-bold text-primary">
                  {LEAD_TIME_MINUTES} minutes ahead
                </span>
                minimum notice
              </li>
            </ul>
          </div>
        </section>

        {/* Booking flow */}
        <section className="bg-white">
          <OfficePartyBooking menu={menu} />
        </section>

        {/* Footer note */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-14 text-center">
            <h2 className="text-2xl font-serif text-primary mb-3">
              Planning something bigger?
            </h2>
            <p className="text-dark/60 leading-relaxed">
              Weddings, large corporate events, and anything outside these pickup windows are
              still best handled by phone. Call{' '}
              <a
                href="tel:+18124999866"
                className="text-primary hover:text-gold transition-colors font-medium"
              >
                (812) 499-9866
              </a>{' '}
              or read more about{' '}
              <Link
                href="/ice-cream-catering-evansville"
                className="text-primary hover:text-gold transition-colors font-medium"
              >
                ice cream catering in Evansville
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
