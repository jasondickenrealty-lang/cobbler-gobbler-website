import type { Metadata } from 'next';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Hours & Location | Cobblestone Creamery — 900 Main St, Evansville, IN',
  description:
    'Visit Cobblestone Creamery at 900 Main Street in downtown Evansville, Indiana 47708. Open 7 days a week. Mon–Thu 11am–9pm, Fri–Sat 11am–10pm, Sun 12pm–8pm. Get directions and call (812) 205-3322.',
  alternates: {
    canonical: `${SITE_URL}/location`,
  },
  openGraph: {
    title: 'Hours & Location | Cobblestone Creamery — Downtown Evansville, IN',
    description:
      'Find Cobblestone Creamery at 900 Main Street in downtown Evansville, Indiana. Open 7 days a week — Mon–Thu 11am–9pm, Fri–Sat 11am–10pm, Sun 12pm–8pm. Order online for pickup.',
    url: `${SITE_URL}/location`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Cobblestone Creamery location map — 900 Main Street, Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hours & Location | Cobblestone Creamery Evansville, IN',
    description:
      'Find us at 900 Main Street in downtown Evansville, IN. Open 7 days a week. Call (812) 205-3322 or order online for pickup.',
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
    telephone: '+18122053322',
    email: 'info@cobblestonecreamery.com',
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
    openingHours: ['Mo-Th 11:00-21:00', 'Fr-Sa 11:00-22:00', 'Su 12:00-20:00'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '11:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '11:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '12:00', closes: '20:00' },
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
