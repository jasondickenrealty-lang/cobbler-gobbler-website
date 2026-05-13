import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monthly Flavors & Menu | Cobblestone Creamery',
  description:
    'Explore this month\'s handcrafted ice cream flavors, classic cobblers, milkshakes, and desserts at Cobblestone Creamery in Evansville, IN. Made fresh daily.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/menu',
  },
  openGraph: {
    title: 'Monthly Flavors & Menu | Cobblestone Creamery',
    description:
      'Explore this month\'s handcrafted ice cream flavors, cobblers, and milkshakes at Cobblestone Creamery in downtown Evansville, IN.',
    url: 'https://cobblestonecreamery.com/menu',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery menu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monthly Flavors & Menu | Cobblestone Creamery',
    description:
      'Explore this month\'s handcrafted ice cream flavors, cobblers, and milkshakes at Cobblestone Creamery in downtown Evansville, IN.',
    images: ['/logo.png'],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
