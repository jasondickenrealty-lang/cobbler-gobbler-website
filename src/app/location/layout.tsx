import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visit Us in Downtown Evansville, IN',
  description:
    'Find Cobblestone Creamery at 900 Main Street in downtown Evansville, IN. Open 7 days a week. View our hours, directions, and contact info.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/location',
  },
  openGraph: {
    title: 'Visit Cobblestone Creamery | Downtown Evansville, IN',
    description:
      'Visit our ice cream shop at 900 Main Street in downtown Evansville, Indiana. Open 7 days a week.',
    url: 'https://cobblestonecreamery.com/location',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery location in Evansville' }],
  },
};

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
