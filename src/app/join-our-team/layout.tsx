import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Our Team | Cobblestone Creamery Evansville, IN',
  description:
    'Now hiring at Cobblestone Creamery in Evansville, IN. Apply for team member, shift lead, manager, and kitchen positions at our downtown ice cream shop.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/join-our-team',
  },
  openGraph: {
    title: 'Join Our Team | Cobblestone Creamery',
    description:
      'We\'re hiring friendly people at Cobblestone Creamery in downtown Evansville, IN. Apply today!',
    url: 'https://cobblestonecreamery.com/join-our-team',
    images: [{ url: '/logo.png', alt: 'Join the Cobblestone Creamery team' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Our Team | Cobblestone Creamery',
    description:
      'Now hiring at Cobblestone Creamery in Evansville, IN. Apply for team member, shift lead, manager, and kitchen positions at our downtown ice cream shop.',
    images: ['/logo.png'],
  },
};

export default function JoinOurTeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
