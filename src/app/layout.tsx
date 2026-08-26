import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Source_Sans_3 } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteContentProvider } from '@/contexts/SiteContentContext';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import PreviewBanner from '@/components/PreviewBanner';
import ChatWidgetGate from '@/components/ChatWidgetGate';
import EmailCapturePopup from '@/components/EmailCapturePopup';
import MobileActionBar from '@/components/MobileActionBar';
import { getSiteContent, type DayHours } from '@/lib/siteContent';
import './globals.css';

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});
const displayFont = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
});

const SITE_URL = 'https://cobblestonecreamery.com';

// `viewportFit: 'cover'` is what makes env(safe-area-inset-*) return real
// values on notched iPhones — without it the safe-area padding on the mobile
// action bar evaluates to 0 and the bar sits under the home indicator.
// initialScale/width are Next's defaults, pinned here so they're explicit.
// Deliberately no maximum-scale / user-scalable=no: pinch zoom stays on.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#10243f',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
    template: '%s | Cobblestone Creamery',
  },
  description:
    'Cobblestone Creamery — Evansville\'s locally owned ice cream shop at 900 Main Street, inside Main Street Food & Beverage. Premium ice cream, fresh waffle cones, signature milkshakes, loaded sundaes, and cobbler bowls. Open 7 days a week in downtown Evansville, IN. Order online for pickup!',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Cobblestone Creamery',
    title: 'Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
    description:
      'Cobblestone Creamery — fresh waffle cones, signature milkshakes, sundaes & cobblers in downtown Evansville, IN. Visit us at 900 Main Street!',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Cobblestone Creamery - Ice Cream Shop in Evansville, Indiana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
    description:
      'Fresh waffle cones, signature milkshakes, sundaes & cobblers at Cobblestone Creamery in downtown Evansville, IN.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/** Schema.org day abbreviations, for the compact `openingHours` strings. */
const DAY_ABBR: Record<string, string> = {
  Monday: 'Mo',
  Tuesday: 'Tu',
  Wednesday: 'We',
  Thursday: 'Th',
  Friday: 'Fr',
  Saturday: 'Sa',
  Sunday: 'Su',
};

/**
 * Structured hours for Google, built from the live config so an owner's edit
 * updates the rich result too. A split day emits one entry per window — that
 * is how Schema.org says "closed 2-4pm", and without it Google would tell
 * searchers the shop is open straight through the gap.
 */
function openingHoursStrings(hours: DayHours[]): string[] {
  return hours.flatMap((entry) => {
    const abbr = DAY_ABBR[entry.day];
    if (!abbr || !entry.open || !entry.close) return [];
    const out = [`${abbr} ${entry.open}-${entry.close}`];
    if (entry.open2 && entry.close2) out.push(`${abbr} ${entry.open2}-${entry.close2}`);
    return out;
  });
}

function openingHoursSpecification(hours: DayHours[]) {
  return hours.flatMap((entry) => {
    if (!entry.open || !entry.close) return [];
    const windows = [{ opens: entry.open, closes: entry.close }];
    if (entry.open2 && entry.close2) {
      windows.push({ opens: entry.open2, closes: entry.close2 });
    }
    return windows.map((w) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.day,
      opens: w.opens,
      closes: w.closes,
    }));
  });
}

const baseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'IceCreamShop',
  name: 'Cobblestone Creamery',
  alternateName: 'Cobblestone Creamery Evansville',
  description: 'Locally owned ice cream shop in downtown Evansville, Indiana, inside Main Street Food & Beverage, serving premium ice cream, fresh waffle cones, signature milkshakes, loaded sundaes, and cobbler bowls. Order online for pickup at 900 Main Street.',
  foundingDate: '2026',
  image: `${SITE_URL}/logo.png`,
  logo: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  telephone: '+18124999866',
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
  menu: `${SITE_URL}/menu`,
  hasMenu: {
    '@type': 'Menu',
    url: `${SITE_URL}/menu`,
  },
  containedInPlace: {
    '@type': 'FoodEstablishment',
    name: 'Main Street Food & Beverage',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '900 Main Street',
      addressLocality: 'Evansville',
      addressRegion: 'IN',
      postalCode: '47708',
      addressCountry: 'US',
    },
  },
  areaServed: [
    { '@type': 'City', name: 'Evansville', '@id': 'https://www.wikidata.org/wiki/Q79860' },
    { '@type': 'City', name: 'Newburgh' },
    { '@type': 'City', name: 'Boonville' },
    { '@type': 'City', name: 'Henderson' },
    { '@type': 'City', name: 'Owensboro' },
  ],
  servesCuisine: ['Ice Cream', 'Desserts', 'Cobblers', 'Milkshakes', 'Waffle Cones', 'Sundaes'],
  priceRange: '$',
  paymentAccepted: 'Cash, Credit Card, Debit Card',
  currenciesAccepted: 'USD',
  sameAs: [
    'https://www.facebook.com/profile.php?id=61588303764359',
  ],
  potentialAction: [
    {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://order.cobblestonecreamery.com',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
    },
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/menu?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cobblestone Creamery',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/menu?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cobblestone Creamery',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'info@cobblestonecreamery.com',
  telephone: '+18124999866',
  foundingDate: '2026',
  sameAs: ['https://www.facebook.com/profile.php?id=61588303764359'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // One fetch per render, shared with every page below via Next's fetch cache
  // and handed to client components through SiteContentProvider.
  const content = await getSiteContent();

  const jsonLd = {
    ...baseJsonLd,
    openingHours: openingHoursStrings(content.hours),
    openingHoursSpecification: openingHoursSpecification(content.hours),
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-sans text-dark">
        <AuthProvider>
          <SiteContentProvider content={content}>
            {content.isPreview ? (
              <PreviewBanner pendingChanges={content.pendingChanges} />
            ) : null}
            <AnnouncementBanner />
            {children}
            <EmailCapturePopup />
            <ChatWidgetGate />
            <MobileActionBar />
          </SiteContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
