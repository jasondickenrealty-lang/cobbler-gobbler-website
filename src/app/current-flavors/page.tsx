import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';
import { FEATURED_FLAVORS } from '@/shared/featured-flavors';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Current Ice Cream Flavors | Cobblestone Creamery in Evansville, IN',
  description:
    'See featured ice cream flavors at Cobblestone Creamery in Evansville, IN, from Vanilla Bean and Chocolate to Superman and Triple Peanut Butter Cup. Flavors rotate, so check the live menu and order online for pickup.',
  alternates: {
    canonical: `${SITE_URL}/current-flavors`,
  },
  openGraph: {
    title: 'Current Ice Cream Flavors | Cobblestone Creamery in Evansville, IN',
    description:
      'Featured ice cream flavors at Cobblestone Creamery in Evansville, IN. Flavors rotate, so check the live menu and order online for pickup.',
    url: `${SITE_URL}/current-flavors`,
    images: [{ url: '/menu-cones/superman.png', width: 800, height: 800, alt: 'Current featured ice cream flavors at Cobblestone Creamery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Current Ice Cream Flavors | Cobblestone Creamery',
    description:
      'Featured ice cream flavors at Cobblestone Creamery in Evansville, IN. Flavors rotate, so check the live menu and order online for pickup.',
    images: ['/menu-cones/superman.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Current Ice Cream Flavors', item: `${SITE_URL}/current-flavors` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Current Ice Cream Flavors',
  url: `${SITE_URL}/current-flavors`,
  description:
    'Featured ice cream flavors at Cobblestone Creamery in Evansville, Indiana. Flavors rotate, and the live menu is the definitive source for what is available.',
  about: {
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
    question: 'How often do your ice cream flavors change?',
    answer:
      'Our flavor lineup rotates, so the scoops available can change from visit to visit. The flavors shown here are featured favorites. For the definitive, up-to-date list of what is available right now, check our live menu.',
  },
  {
    question: 'What is the definitive list of available flavors?',
    answer:
      'The live menu is always the definitive source for what is in stock. This page highlights featured flavors, but the menu reflects what you can actually order today.',
  },
  {
    question: 'Can I order my favorite flavor online for pickup?',
    answer:
      'Yes. You can order ice cream online for pickup at our downtown Evansville shop at 900 Main Street. If a specific flavor is important to you, checking the live menu first is the best way to confirm it is available.',
  },
  {
    question: 'Do you have dairy-free options?',
    answer:
      'We carry dairy-free options alongside our ice cream. Because availability rotates, the live menu or a quick call to (812) 205-3322 is the best way to confirm what is on hand.',
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

export default function CurrentFlavorsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Current Ice Cream Flavors
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Here are some of the featured ice cream flavors you will find at
              Cobblestone Creamery in downtown Evansville. Our lineup rotates, so
              treat this as a taste of what we love to scoop. For the live,
              up-to-the-minute list, always check our full menu.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/menu"
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View the Live Menu
              </Link>
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Ice Cream for Pickup
              </a>
            </div>
          </div>
        </section>

        {/* Flavor grid */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-4 text-center">
              Featured Flavors
            </h2>
            <p className="text-dark/50 text-center mb-10 max-w-xl mx-auto">
              A rotating selection of the scoops our Evansville regulars reach
              for again and again.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {FEATURED_FLAVORS.map((flavor) => (
                <div key={flavor.id} className="bg-cream rounded-lg overflow-hidden border border-gold/20">
                  <div className="relative aspect-square bg-white">
                    <Image
                      src={flavor.image}
                      alt={`${flavor.name} ice cream at Cobblestone Creamery`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-serif text-lg text-primary">{flavor.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prose */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              Flavors That Rotate, Classics That Stay
            </h2>
            <p>
              Part of the fun of a scoop shop is that it is a little different
              every time. At Cobblestone Creamery, our flavor lineup rotates, so
              the case you see on one visit might feature something new the next.
              A few beloved classics tend to stick around because Evansville
              would not have it any other way, while other flavors come and go to
              keep things interesting. The flavors featured above, from Vanilla
              Bean and Chocolate to Superman, Mint Chocolate Chip, Cake Batter,
              Cookies and Cream, Strawberry, and Triple Peanut Butter Cup, are
              favorites we are proud to scoop.
            </p>
            <p>
              Because flavors change, we want to be clear about one thing: this
              page is a highlight reel, not a live inventory. The definitive,
              always-current list of what you can order today lives on our menu.
              If you have your heart set on a particular scoop, checking the menu
              first, or calling ahead, is the surest way to know it is waiting
              for you.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Turn a Flavor Into a Treat
            </h2>
            <p>
              Once you have found your flavor, the possibilities open up. Enjoy
              it as a simple scoop in a cup, in a fresh waffle cone pressed to
              order, or in a waffle bowl. Blend it into a signature milkshake,
              build it into a loaded sundae, or drop a scoop into a float. Every
              featured flavor here can become the starting point for one of our
              made-to-order specialty desserts. When you are ready, you can{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>,{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">order ice cream for pickup</a>, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>{' '}
              at 900 Main Street.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-10 text-center">
              Flavor FAQs
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
              See What We Are Scooping Today
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Check the live menu for today&apos;s flavors and order online for
              pickup at our downtown Evansville shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                View Live Menu
              </Link>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-white/30 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
