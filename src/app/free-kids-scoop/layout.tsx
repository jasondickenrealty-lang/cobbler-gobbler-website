import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Kids Scoop | Cobblestone Creamery Evansville, IN',
  description:
    'Download a free coloring page, color it at home, and bring it to Cobblestone Creamery at 900 Main Street in Evansville, IN for a free kids scoop of ice cream. A fun treat for the whole family!',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/free-kids-scoop',
  },
  openGraph: {
    title: 'Free Kids Ice Cream Scoop | Cobblestone Creamery Evansville, IN',
    description:
      'Download a free coloring page and bring it in for a free kids scoop at Cobblestone Creamery in downtown Evansville, IN. Great for families!',
    url: 'https://cobblestonecreamery.com/free-kids-scoop',
    images: [{ url: '/logo.png', alt: 'Free kids ice cream scoop at Cobblestone Creamery Evansville IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Kids Ice Cream Scoop in Evansville, IN | Cobblestone Creamery',
    description:
      'Download a free coloring page and bring it in for a free kids scoop at Cobblestone Creamery in downtown Evansville, IN. Great for families!',
    images: ['/logo.png'],
  },
};

export default function FreeKidsScoopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
