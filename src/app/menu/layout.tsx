import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ice Cream Menu | Cobblestone Creamery — Evansville, IN',
  description:
    'View the full ice cream menu at Cobblestone Creamery in downtown Evansville, Indiana. Handcrafted scoops, waffle cones, milkshakes, sundaes, and classic cobblers made fresh daily. Order online for pickup!',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/menu',
  },
  openGraph: {
    title: 'Ice Cream Menu | Cobblestone Creamery Evansville, IN',
    description:
      'Handcrafted ice cream, waffle cones, milkshakes, sundaes & classic cobblers at Cobblestone Creamery — 900 Main Street, downtown Evansville, IN. Order online for pickup!',
    url: 'https://cobblestonecreamery.com/menu',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Cobblestone Creamery ice cream menu — Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Cream Menu | Cobblestone Creamery Evansville, IN',
    description:
      'Handcrafted ice cream, waffle cones, milkshakes & cobblers at Cobblestone Creamery in downtown Evansville, IN. Fresh daily — order online for pickup!',
    images: ['/logo.png'],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
