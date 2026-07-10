import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Ice Cream Fundraising in Evansville, IN | Cobblestone Creamery',
  description:
    'Raise money for your Evansville school, sports team, or nonprofit with an ice cream fundraiser at Cobblestone Creamery on Main Street. A fun, community-first way to support local groups. Book your Evansville fundraising night.',
  alternates: {
    canonical: `${SITE_URL}/ice-cream-fundraising-evansville`,
  },
  openGraph: {
    title: 'Ice Cream Fundraising in Evansville, IN | Cobblestone Creamery',
    description:
      'Fundraisers for Evansville schools, sports teams, and nonprofits at Cobblestone Creamery on Main Street. A sweet, community-first way to raise money.',
    url: `${SITE_URL}/ice-cream-fundraising-evansville`,
    images: [{ url: '/menu-cones/superman.png', width: 800, height: 800, alt: 'Ice cream fundraising for Evansville groups at Cobblestone Creamery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Cream Fundraising in Evansville, IN | Cobblestone Creamery',
    description:
      'Fundraisers for Evansville schools, sports teams, and nonprofits. A sweet, community-first way to raise money at Cobblestone Creamery on Main Street.',
    images: ['/menu-cones/superman.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Ice Cream Fundraising in Evansville, IN', item: `${SITE_URL}/ice-cream-fundraising-evansville` },
  ],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ice Cream Fundraising in Evansville, IN',
  serviceType: 'Fundraising nights for schools, teams, and nonprofits',
  url: `${SITE_URL}/ice-cream-fundraising-evansville`,
  description:
    'Ice cream fundraising nights that help Evansville schools, sports teams, and nonprofits raise money in a fun, community-first way at Cobblestone Creamery.',
  areaServed: [
    { '@type': 'City', name: 'Evansville' },
    { '@type': 'City', name: 'Newburgh' },
    { '@type': 'City', name: 'Boonville' },
  ],
  provider: {
    '@type': 'IceCreamShop',
    name: 'Cobblestone Creamery',
    telephone: '+1-812-205-3322',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '900 Main Street',
      addressLocality: 'Evansville',
      addressRegion: 'IN',
      postalCode: '47708',
      addressCountry: 'US',
    },
  },
};

const FAQ_ITEMS = [
  {
    question: 'What kinds of Evansville groups can hold an ice cream fundraiser?',
    answer:
      'We love supporting local schools, PTOs, youth and school sports teams, booster clubs, church groups, and nonprofits across Evansville and the surrounding area. If your group is working toward a goal, an ice cream night is a fun way to bring your community together.',
  },
  {
    question: 'How does an ice cream fundraiser work?',
    answer:
      'Your supporters come to Cobblestone Creamery to enjoy ice cream and treats, and a portion of the proceeds helps your cause. It turns a normal dessert run into an easy way to give back. Visit our Fundraising page to see the details and book your night.',
  },
  {
    question: 'How do we book a fundraising night in Evansville?',
    answer:
      'Head to our Fundraising page to get started, or call us at (812) 205-3322. Reach out with your group name, your preferred date, and roughly how many supporters you expect, and we will help you set it up.',
  },
  {
    question: 'Is this the same as your main fundraising program?',
    answer:
      'This page is a local guide for Evansville schools, teams, and nonprofits. All bookings and program details live on our main Fundraising page, which is the place to reserve your date.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function IceCreamFundraisingEvansvillePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Ice Cream Fundraising in Evansville, IN
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Raising money for a good cause should be as fun as it is
              rewarding. Cobblestone Creamery helps Evansville schools, sports
              teams, and nonprofits turn a night of ice cream into support for
              the goals that matter to them, right here on Main Street in
              downtown Evansville.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/fundraising"
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Plan an Evansville Fundraising Night
              </Link>
              <a
                href="tel:+18122053322"
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                Call to Ask a Question
              </a>
            </div>
          </div>
        </section>

        {/* Prose */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              Fundraising That Brings Evansville Together
            </h2>
            <p>
              The best fundraisers do not feel like fundraisers. They feel like a
              night out. When a group of families, teammates, and neighbors show
              up for ice cream, the money raised is almost a bonus on top of the
              memories. That is the idea behind ice cream fundraising at
              Cobblestone Creamery. We are a locally owned shop that opened in
              2026, and supporting the Evansville community is part of why we are
              here. A fundraising night lets your supporters enjoy premium ice
              cream, sundaes, and milkshakes while helping your cause at the same
              time.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Perfect for Schools, Teams, and Nonprofits
            </h2>
            <p>
              Evansville is full of groups working toward something. Schools and
              PTOs raising money for classroom supplies or a big trip. Youth and
              school sports teams covering uniforms, tournament travel, or new
              equipment. Booster clubs, band programs, and church youth groups
              building toward a shared goal. Nonprofits rallying their supporters
              around a mission. An ice cream fundraiser fits all of them because
              it is simple to promote and genuinely fun to attend. Send a note to
              your families, pick a date, and let dessert do the rest.
            </p>
            <p>
              Because everyone loves ice cream, participation tends to take care
              of itself. Kids get excited, parents are happy to bring them out,
              and coaches and organizers get an easy event that does not require
              selling wrapping paper or coupon books door to door. It is a
              community-first way to raise money that leaves your supporters
              looking forward to the next one.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Ready to Book Your Night?
            </h2>
            <p>
              Booking and all program details live on our main fundraising page,
              which is the best place to reserve your date and see how it works.
              Head over to{' '}
              <Link href="/fundraising" className="text-primary hover:text-gold transition-colors font-medium">plan an Evansville fundraising night</Link>{' '}
              to get started, or call us at{' '}
              <a href="tel:+18122053322" className="text-primary hover:text-gold transition-colors font-medium">(812) 205-3322</a>{' '}
              with any questions. While you are planning, you can{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>{' '}
              your supporters will enjoy, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>.
              We are proud to serve Evansville and the wider Southern Indiana
              tri-state area, including Newburgh and Boonville.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Visit Us in Downtown Evansville
            </h2>
            <div className="max-w-xl mx-auto text-center">
              <address className="not-italic text-dark/70 space-y-2">
                <p className="font-serif text-xl text-primary">Cobblestone Creamery</p>
                <p>Inside Main Street Food &amp; Beverage</p>
                <p>900 Main Street, Evansville, Indiana 47708</p>
                <p className="pt-2">
                  <a href="tel:+18122053322" className="text-primary hover:text-gold transition-colors font-medium">
                    (812) 205-3322
                  </a>
                </p>
              </address>
              <div className="mt-4 space-y-1 text-dark/70">
                <p>Monday &ndash; Thursday: 11am &ndash; 9pm</p>
                <p>Friday &ndash; Saturday: 11am &ndash; 10pm</p>
                <p>Sunday: 12pm &ndash; 8pm</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/fundraising"
                  className="inline-block bg-primary text-white px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors text-center"
                >
                  Book a Fundraiser
                </Link>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-primary/30 text-primary px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/5 transition-colors text-center"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-10 text-center">
              Fundraising FAQs
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-cream rounded-lg p-6 border border-gold/20">
                  <h3 className="font-serif text-lg text-primary mb-2">{item.question}</h3>
                  <p className="text-dark/60 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Turn Dessert Into Support for Your Cause
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Book your Evansville fundraising night and give your school, team,
              or nonprofit a fun way to reach its goal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fundraising"
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Plan a Fundraiser
              </Link>
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block border border-white/30 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                Order Online
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
