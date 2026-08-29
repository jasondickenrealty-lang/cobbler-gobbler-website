import type { Metadata } from 'next';

// ── SEO A/B Title Variants ──────────────────────────────────────────────────
// Variant A (current): hours + address in title (high local intent)
//   'Hours & Location | Cobblestone Creamery — 900 Main St, Evansville, IN'
// Variant B: directions-focused ("how to get to" intent)
//   'Directions & Hours | Cobblestone Creamery — Downtown Evansville, IN'
// Variant C: near-me intent
//   'Ice Cream Near Me — Cobblestone Creamery | 900 Main St, Evansville IN'
//
// ── SEO A/B Description Variants ───────────────────────────────────────────
// Variant A (current):
//   "Visit Cobblestone Creamery at 900 Main Street in downtown Evansville,
//    Indiana 47708. Open 7 days a week. Mon–Thu 11–2 & 4–9, Fri 11–2 & 4–10,
//    Sat 11–10, Sun 12–6. Get directions and call (812) 499-9866."
// Variant B: parking + landmark (reduces friction for first-timers)
//   "Find Cobblestone Creamery in downtown Evansville at 900 Main Street —
//    easy parking nearby. Open 7 days: Mon–Thu 11–2 & 4–9, Fri 11–2 & 4–10,
//    Sat 11–10, Sun 12–6. Call (812) 499-9866 or order ahead online."
// Variant C: neighborhood story (works for 'things to do in evansville' intent)
//   "Cobblestone Creamery is in the heart of downtown Evansville, IN at
//    900 Main Street. Open 7 days a week for walk-ins and online pickup
//    orders. Your next scoop is closer than you think."
// ───────────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Hours & Location | Cobblestone Creamery — 900 Main St, Evansville, IN',
  description:
    'Visit Cobblestone Creamery at 900 Main Street in downtown Evansville, Indiana 47708. Open 7 days a week. Mon–Thu 11–2 & 4–9, Fri 11–2 & 4–10, Sat 11–10, Sun 12–6. Get directions and call (812) 499-9866.',
  alternates: {
    canonical: `${SITE_URL}/location`,
  },
  openGraph: {
    title: 'Hours & Location | Cobblestone Creamery — Downtown Evansville, IN',
    description:
      'Find Cobblestone Creamery at 900 Main Street in downtown Evansville, Indiana. Open 7 days a week — Mon–Thu 11–2 & 4–9, Fri 11–2 & 4–10, Sat 11–10, Sun 12–6. Order online for pickup.',
    url: `${SITE_URL}/location`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Cobblestone Creamery location map — 900 Main Street, Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hours & Location | Cobblestone Creamery Evansville, IN',
    description:
      'Find us at 900 Main Street in downtown Evansville, IN. Open 7 days a week. Call (812) 499-9866 or order online for pickup.',
    images: ['/logo.png'],
  },
};

const locationJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Location & Hours', item: `${SITE_URL}/location` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'IceCreamShop',
    name: 'Cobblestone Creamery',
    url: SITE_URL,
    telephone: '+18124999866',
    email: 'cobblestonecreameryllc@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '900 Main Street',
      addressLocality: 'Evansville',
      addressRegion: 'IN',
      postalCode: '47708',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.9716,
      longitude: -87.5711,
    },
    hasMap: 'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708',
    openingHours: ['Mo-Th 11:00-14:00', 'Mo-Th 16:00-21:00', 'Fr 11:00-14:00', 'Fr 16:00-22:00', 'Sa 11:00-22:00', 'Su 12:00-18:00'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '11:00', closes: '14:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '16:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '11:00', closes: '14:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '16:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '11:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '12:00', closes: '18:00' },
    ],
    priceRange: '$',
    image: `${SITE_URL}/logo.png`,
  },
];

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd) }}
      />
      {children}
    </>
  );
}
