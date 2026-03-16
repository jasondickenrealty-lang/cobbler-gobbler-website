import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
    template: '%s | Cobblestone Creamery',
  },
  description:
    'Cobblestone Creamery is the best ice cream shop in Evansville, Indiana. Fresh waffle cones, signature milkshakes, sundaes, and classic cobblers made daily. Visit us at 900 Main Street in downtown Evansville, IN. Order online for pickup!',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'IceCreamShop',
  name: 'Cobblestone Creamery',
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  telephone: '(812) 205-3322',
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '11:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '11:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '12:00',
      closes: '20:00',
    },
  ],
  menu: `${SITE_URL}/menu`,
  hasMenu: {
    '@type': 'Menu',
    url: `${SITE_URL}/menu`,
  },
  servesCuisine: ['Ice Cream', 'Desserts', 'Cobblers', 'Milkshakes'],
  priceRange: '$',
  sameAs: [
    'https://www.facebook.com/profile.php?id=61588303764359',
  ],
  potentialAction: {
    '@type': 'OrderAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://order.cobblestonecreamery.com/auth',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-dark">
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
