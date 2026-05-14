import type { Metadata } from 'next';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Cobbler Eating Contest Signup | Cobblestone Creamery Evansville, IN',
  description:
    'Sign up for the 1st Annual Cobbler Eating Contest at Cobblestone Creamery in Evansville, Indiana — Sunday, May 24, 2026 at Food Truck Fest. Only 10 spots available. Win up to $100 cash!',
  alternates: {
    canonical: `${SITE_URL}/contest-signup`,
  },
  openGraph: {
    title: '1st Annual Cobbler Eating Contest | Cobblestone Creamery — May 24, 2026',
    description:
      'Sign up now — only 10 spots! Eat the Peach Cobbler Cheesecake Bowl fastest at Food Truck Fest in downtown Evansville, IN on May 24, 2026. Win up to $100 cash.',
    url: `${SITE_URL}/contest-signup`,
    images: [
      {
        url: `${SITE_URL}/assets/cobbler-eating-contest-flyer.png`,
        width: 768,
        height: 1280,
        alt: 'Cobblestone Creamery 1st Annual Cobbler Eating Contest — May 24, 2026, Evansville IN',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1st Annual Cobbler Eating Contest | Cobblestone Creamery Evansville, IN',
    description:
      'Only 10 spots! Eat the Peach Cobbler Cheesecake Bowl fastest and win up to $100. Sunday May 24 at Food Truck Fest — downtown Evansville.',
    images: [`${SITE_URL}/assets/cobbler-eating-contest-flyer.png`],
  },
};

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEvent',
  name: '1st Annual Cobbler Eating Contest',
  description:
    "Competitive eating contest featuring Cobblestone Creamery's Peach Cobbler Cheesecake Bowl at Food Truck Fest in downtown Evansville, Indiana. Only 10 contestants. Fastest finish wins $100 cash.",
  startDate: '2026-05-24',
  endDate: '2026-05-24',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Cobblestone Creamery — Food Truck Fest',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '900 Main Street',
      addressLocality: 'Evansville',
      addressRegion: 'IN',
      postalCode: '47708',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Cobblestone Creamery',
    url: SITE_URL,
    telephone: '(812) 205-3322',
  },
  offers: {
    '@type': 'Offer',
    name: 'Contest Registration',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/contest-signup`,
  },
};

export default function ContestSignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {children}
    </>
  );
}