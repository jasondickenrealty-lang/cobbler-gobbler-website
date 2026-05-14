import type { Metadata } from 'next';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Free Kids Ice Cream Scoop | Cobblestone Creamery Evansville, IN',
  description:
    'Get a free kids scoop at Cobblestone Creamery in Evansville, Indiana! Download a free coloring page, color it at home, and bring it to 900 Main Street for a free ice cream scoop. Fun for the whole family!',
  alternates: {
    canonical: `${SITE_URL}/free-kids-scoop`,
  },
  openGraph: {
    title: 'Free Kids Ice Cream Scoop | Cobblestone Creamery — Evansville, IN',
    description:
      'Download a free coloring page, color it at home, and bring it to Cobblestone Creamery at 900 Main Street in Evansville, IN for a free kids scoop of ice cream. Great for families!',
    url: `${SITE_URL}/free-kids-scoop`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Free kids ice cream scoop coloring program at Cobblestone Creamery Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Kids Ice Cream Scoop in Evansville, IN | Cobblestone Creamery',
    description:
      'Download, color, and bring in a coloring page for a FREE kids scoop at Cobblestone Creamery — 900 Main Street, downtown Evansville, IN. Great family fun!',
    images: ['/logo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Free Kids Scoop', item: `${SITE_URL}/free-kids-scoop` },
  ],
};

export default function FreeKidsScoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
