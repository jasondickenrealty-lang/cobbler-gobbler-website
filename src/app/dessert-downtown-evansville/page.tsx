import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Dessert in Downtown Evansville | Cobblestone Creamery on Main Street',
  description:
    'Looking for dessert in downtown Evansville? Cobblestone Creamery serves ice cream, sundaes, cobbler bowls, floats, and made-to-order specialty desserts at 900 Main Street near the Ford Center. Open seven days a week.',
  alternates: {
    canonical: `${SITE_URL}/dessert-downtown-evansville`,
  },
  openGraph: {
    title: 'Dessert in Downtown Evansville | Cobblestone Creamery',
    description:
      'Ice cream, sundaes, cobbler bowls, and made-to-order specialty desserts at 900 Main Street in downtown Evansville, near the Ford Center. Open seven days a week.',
    url: `${SITE_URL}/dessert-downtown-evansville`,
    images: [{ url: '/menu-cones/cake-batter.png', width: 800, height: 800, alt: 'Made-to-order dessert at Cobblestone Creamery in downtown Evansville' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dessert in Downtown Evansville | Cobblestone Creamery',
    description:
      'Ice cream, sundaes, cobbler bowls, and specialty desserts on Main Street in downtown Evansville, IN. Perfect after dinner or a Ford Center event.',
    images: ['/menu-cones/cake-batter.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Dessert in Downtown Evansville', item: `${SITE_URL}/dessert-downtown-evansville` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Dessert in Downtown Evansville',
  url: `${SITE_URL}/dessert-downtown-evansville`,
  description:
    'A guide to dessert in downtown Evansville, Indiana, featuring ice cream, sundaes, cobbler bowls, floats, and specialty desserts at Cobblestone Creamery, 900 Main Street.',
  about: {
    '@type': 'IceCreamShop',
    name: 'Cobblestone Creamery',
    telephone: '+1-812-499-9866',
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
    question: 'Where can I get dessert in downtown Evansville?',
    answer:
      'Cobblestone Creamery is located inside Main Street Food & Beverage at 900 Main Street, Evansville, IN 47708, in the heart of downtown near the Ford Center. We serve ice cream, sundaes, cobbler bowls, floats, milkshakes, and other made-to-order desserts.',
  },
  {
    question: 'Are you open late enough for dessert after a Ford Center event?',
    answer:
      'We are open Monday through Thursday from 11am to 2pm and 4pm to 9pm, Friday from 11am to 2pm and 4pm to 10pm, Saturday from 11am to 10pm, and Sunday from 12pm to 6pm. Late Friday and Saturday hours make us an easy dessert stop after a downtown show or game.',
  },
  {
    question: 'Can I order dessert ahead for pickup?',
    answer:
      'Yes. Order online and pick up at our downtown Evansville shop. Ordering ahead is a great way to grab dessert for the group without waiting during a busy evening.',
  },
  {
    question: 'What desserts do you serve besides ice cream?',
    answer:
      'Beyond ice cream scoops, we make signature milkshakes, loaded sundaes, cobbler bowls, waffle nachos, floats, and fresh waffle cones and waffle bowls pressed to order. We also carry dairy-free options.',
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

export default function DessertDowntownEvansvillePage() {
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
              Dessert in Downtown Evansville
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              When the meal is done and the night is young, Cobblestone Creamery
              is downtown Evansville&apos;s spot for dessert. Find us on Main
              Street inside Main Street Food &amp; Beverage, a short walk from the
              Ford Center, serving ice cream, sundaes, cobbler bowls, and
              made-to-order specialty desserts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Dessert for Pickup
              </a>
              <Link
                href="/menu"
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View the Full Menu
              </Link>
            </div>
          </div>
        </section>

        {/* Prose */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              The Sweet End to a Downtown Night
            </h2>
            <p>
              Downtown Evansville has a rhythm to it. Dinner on Main Street, a
              show or a game at the Ford Center, a walk past the storefronts as
              the evening settles in. Dessert is the part that ties it all
              together, and that is where we come in. Cobblestone Creamery sits
              right on Main Street inside Main Street Food &amp; Beverage, close
              enough that dessert is never a detour. Whether you are wrapping up
              date night, wrangling a family, or celebrating after an event, we
              are built to be the last, sweetest stop of the evening.
            </p>
            <p>
              Ice cream is the heart of the menu, with rotating and classic
              scoop flavors ready in a cup, a waffle bowl, or a fresh waffle
              cone pressed to order. But downtown desserts should give you
              options, so we go further. Loaded sundaes let a group pile on
              sauces, whipped topping, and their favorite mix-ins. Cobbler bowls
              deliver that warm-and-cold contrast that makes people close their
              eyes on the first bite. Floats bring the fizzy, nostalgic combo of
              soda and premium ice cream. And when you want something to share
              across the table, waffle nachos are made for passing around.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Easy to Reach, Easy to Enjoy
            </h2>
            <p>
              Part of what makes a great dessert spot is that it fits into your
              night without friction. We keep evening hours seven days a week,
              stretching to 10pm on Friday and Saturday, so a late dessert run
              after a downtown event is always on the table. If you would rather
              skip the wait, order ahead online and pick up on your way through.
              Big group? Grab a round of milkshakes and a couple of sundaes to
              go and enjoy them along the riverfront or back at home.
            </p>
            <p>
              We are locally owned, opened in 2026, and proud to be part of the
              downtown Evansville scene. Beyond the city, we welcome friends from
              across the Southern Indiana tri-state area, including Newburgh,
              Boonville, and nearby Henderson and Owensboro in Kentucky. Ready to
              make it a sweet night? You can{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">order ice cream for pickup</a>,{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>,{' '}
              <Link href="/about" className="text-primary hover:text-gold transition-colors font-medium">read our story</Link>, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Find Dessert on Main Street
            </h2>
            <div className="max-w-xl mx-auto text-center">
              <address className="not-italic text-dark/70 space-y-2">
                <p className="font-serif text-xl text-primary">Cobblestone Creamery</p>
                <p>Inside Main Street Food &amp; Beverage</p>
                <p>900 Main Street, Evansville, Indiana 47708</p>
                <p className="pt-2">
                  <a href="tel:+18124999866" className="text-primary hover:text-gold transition-colors font-medium">
                    (812) 499-9866
                  </a>
                </p>
              </address>
              <div className="mt-4 space-y-1 text-dark/70">
                <p>Monday &ndash; Thursday: 11am &ndash; 2pm, 4pm &ndash; 9pm</p>
                <p>Friday: 11am &ndash; 2pm, 4pm &ndash; 10pm</p>
                <p>Saturday: 11am &ndash; 10pm</p>
                <p>Sunday: 12pm &ndash; 6pm</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors text-center"
                >
                  Get Directions
                </a>
                <a
                  href="tel:+18124999866"
                  className="inline-block border border-primary/30 text-primary px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/5 transition-colors text-center"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-10 text-center">
              Downtown Dessert FAQs
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
              Make It a Sweet Night Downtown
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Order dessert ahead for pickup or stroll over to our Main Street
              shop. We are ready whenever your night calls for something sweet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Online
              </a>
              <Link
                href="/location"
                className="inline-block border border-white/30 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
