import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfficePartyHostForm from '@/components/office-party/OfficePartyHostForm';
import { MIN_SUBTOTAL_CENTS, MAX_DAYS_AHEAD } from '@/lib/partySlots';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Host an Office Party | Cobblestone Creamery Evansville',
  description:
    'Set up an ice cream office party in Evansville, share the link with your coworkers, and let everyone order and pay for what they want. $75 minimum, delivered to your floor.',
  alternates: {
    canonical: `${SITE_URL}/office-party-reservation`,
  },
  openGraph: {
    title: 'Host an Office Party | Cobblestone Creamery',
    description:
      'Set up the party, share the link, let everyone order their own. $75 minimum, delivered to your floor.',
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
      name: 'Host an Office Party',
      item: `${SITE_URL}/office-party-reservation`,
    },
  ],
};

const MINIMUM_LABEL = `$${(MIN_SUBTOTAL_CENTS / 100).toFixed(0)}`;

const STEPS = [
  {
    title: 'Set it up',
    body: 'Tell us your company, where in the building to deliver, and when. Takes a minute, and costs nothing.',
  },
  {
    title: 'Share the link',
    body: 'Send it around the office. Everyone picks their own thing off the full menu — no group spreadsheet.',
  },
  {
    title: `Hit ${MINIMUM_LABEL} and it's on`,
    body: 'The party goes ahead as soon as the orders add up to the minimum. Until then nobody is charged.',
  },
];

export default function OfficePartyReservationPage() {
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
              Host an Office Party
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Start the party here, then send the link around and let everyone order what
              they actually want. We box it all up and bring it to your floor.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl bg-white/70 px-5 py-4 text-sm text-dark/70"
                >
                  <span className="block text-xs font-bold uppercase tracking-widest text-gold">
                    Step {index + 1}
                  </span>
                  <span className="mt-1 block font-bold text-primary">{step.title}</span>
                  <span className="mt-1 block leading-6">{step.body}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-dark/55">
              {MINIMUM_LABEL} minimum before tax · 11am, 12pm or 1pm delivery · book up to{' '}
              {MAX_DAYS_AHEAD} days ahead
            </p>
          </div>
        </section>

        {/* Host setup */}
        <section className="bg-white">
          <OfficePartyHostForm />
        </section>

        {/* Footer note */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-14 text-center">
            <h2 className="text-2xl font-serif text-primary mb-3">Planning something bigger?</h2>
            <p className="text-dark/60 leading-relaxed">
              Weddings, large corporate events, and anything outside these delivery windows are
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
              . You can also{' '}
              <Link
                href="/menu"
                className="text-primary hover:text-gold transition-colors font-medium"
              >
                browse the full menu
              </Link>{' '}
              before you set anything up.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
