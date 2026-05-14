import type { Metadata } from 'next';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Now Hiring | Cobblestone Creamery — Ice Cream Jobs in Evansville, IN',
  description:
    'Now hiring at Cobblestone Creamery in downtown Evansville, Indiana! We are looking for friendly team members, shift leads, managers, and kitchen staff. Apply online today at 900 Main Street.',
  alternates: {
    canonical: `${SITE_URL}/join-our-team`,
  },
  openGraph: {
    title: 'Now Hiring | Cobblestone Creamery — Evansville, IN',
    description:
      'Join the Cobblestone Creamery team in downtown Evansville, IN! We are hiring team members, shift leads, managers, and kitchen staff. Apply online today.',
    url: `${SITE_URL}/join-our-team`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Join the Cobblestone Creamery team in Evansville, Indiana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Now Hiring at Cobblestone Creamery | Evansville, IN',
    description:
      'We are hiring at Cobblestone Creamery in downtown Evansville, IN. Team members, shift leads, managers & kitchen staff. Apply online today!',
    images: ['/logo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Join Our Team', item: `${SITE_URL}/join-our-team` },
  ],
};

const jobPostingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Ice Cream Shop Team Member',
  description:
    'Cobblestone Creamery in downtown Evansville, Indiana is hiring friendly, reliable team members for customer service, scooping, and shop operations. Multiple positions available.',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Cobblestone Creamery',
    sameAs: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '900 Main Street',
      addressLocality: 'Evansville',
      addressRegion: 'IN',
      postalCode: '47708',
      addressCountry: 'US',
    },
  },
  employmentType: 'PART_TIME',
  datePosted: '2026-01-01',
  validThrough: '2026-12-31',
  applicantLocationRequirements: {
    '@type': 'Country',
    name: 'United States',
  },
};

export default function JoinOurTeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, jobPostingJsonLd]) }}
      />
      {children}
    </>
  );
}
