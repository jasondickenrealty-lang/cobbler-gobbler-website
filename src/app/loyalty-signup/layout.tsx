import type { Metadata } from 'next';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Join Our Loyalty Program | Cobblestone Creamery Evansville, IN',
  description:
    'Sign up for the Cobblestone Creamery loyalty program and earn rewards on every visit. Join today at our ice cream shop in downtown Evansville, Indiana.',
  alternates: {
    canonical: `${SITE_URL}/loyalty-signup`,
  },
  openGraph: {
    title: 'Join Our Loyalty Program | Cobblestone Creamery',
    description:
      'Sign up for the Cobblestone Creamery loyalty program and earn rewards on every visit in downtown Evansville, IN.',
    url: `${SITE_URL}/loyalty-signup`,
    images: [{ url: `${SITE_URL}/logo.png`, alt: 'Cobblestone Creamery loyalty program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Our Loyalty Program | Cobblestone Creamery',
    description:
      'Sign up for the Cobblestone Creamery loyalty program and earn rewards on every visit.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function LoyaltySignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
