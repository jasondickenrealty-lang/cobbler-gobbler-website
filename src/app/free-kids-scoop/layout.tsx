import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Kids Scoop - Coloring Pages',
  description:
    'Download a free coloring page, color it at home, and bring it to Cobblestone Creamery in Evansville, IN for a free kids scoop of ice cream!',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/free-kids-scoop',
  },
  openGraph: {
    title: 'Free Kids Scoop | Cobblestone Creamery',
    description:
      'Download a coloring page and bring it in for a free kids scoop at Cobblestone Creamery in Evansville, IN!',
    url: 'https://cobblestonecreamery.com/free-kids-scoop',
    images: [{ url: '/logo.png', alt: 'Free kids scoop at Cobblestone Creamery' }],
  },
};

export default function FreeKidsScoopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
