import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Ice Cream Catering in Evansville, IN | Cobblestone Creamery Events',
  description:
    'Ice cream catering for Evansville office parties, corporate events, and weddings. Cobblestone Creamery on Main Street helps you plan a sweet spread of ice cream, sundaes, and milkshakes for your downtown Evansville gathering. Call to plan yours.',
  alternates: {
    canonical: `${SITE_URL}/ice-cream-catering-evansville`,
  },
  openGraph: {
    title: 'Ice Cream Catering in Evansville, IN | Cobblestone Creamery',
    description:
      'Plan ice cream, sundaes, and milkshakes for Evansville office parties, corporate events, and weddings with Cobblestone Creamery on Main Street.',
    url: `${SITE_URL}/ice-cream-catering-evansville`,
    images: [{ url: '/menu-cones/strawberry.jpg', width: 800, height: 800, alt: 'Ice cream catering for Evansville events by Cobblestone Creamery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Cream Catering in Evansville, IN | Cobblestone Creamery',
    description:
      'Ice cream, sundaes, and milkshakes for Evansville office parties, corporate events, and weddings. Plan your sweet spread with Cobblestone Creamery.',
    images: ['/menu-cones/strawberry.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Ice Cream Catering in Evansville, IN', item: `${SITE_URL}/ice-cream-catering-evansville` },
  ],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ice Cream Catering in Evansville, IN',
  serviceType: 'Ice cream and dessert catering',
  url: `${SITE_URL}/ice-cream-catering-evansville`,
  description:
    'Ice cream, sundae, and milkshake catering for office parties, corporate events, and weddings in Evansville and the Southern Indiana tri-state area.',
  areaServed: [
    { '@type': 'City', name: 'Evansville' },
    { '@type': 'City', name: 'Newburgh' },
    { '@type': 'City', name: 'Boonville' },
    { '@type': 'City', name: 'Henderson' },
    { '@type': 'City', name: 'Owensboro' },
  ],
  provider: {
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
    question: 'What kinds of Evansville events do you help with?',
    answer:
      'We love helping with office parties, corporate lunches, employee appreciation days, wedding dessert tables, showers, and milestone celebrations around Evansville and the tri-state area. If your gathering could use ice cream, we are happy to help you plan a sweet spread.',
  },
  {
    question: 'How do I plan ice cream catering for my event?',
    answer:
      'The best first step is to call us at (812) 499-9866 or place a large pickup order online. Tell us your date, headcount, and the kinds of treats you want, and we will help you put together a plan that fits your event.',
  },
  {
    question: 'What can you include in an event order?',
    answer:
      'Popular choices include premium ice cream by the scoop, loaded sundaes, signature milkshakes prepared fresh to order, floats, fresh waffle cones, and cobbler bowls. We also carry dairy-free options so more of your guests can join in.',
  },
  {
    question: 'How far in advance should I reach out?',
    answer:
      'For larger events like weddings and corporate functions, reach out as early as you can so we can plan around your date and headcount. For smaller office gatherings, a pickup order placed ahead of time is often all you need.',
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

export default function IceCreamCateringEvansvillePage() {
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
              Ice Cream Catering in Evansville, IN
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Turn your Evansville office party, corporate event, or wedding into
              something guests remember with ice cream from Cobblestone Creamery.
              From sundaes to signature milkshakes, we help you plan a sweet
              spread from our home base on Main Street in downtown Evansville.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+18124999866"
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Call to Plan Your Event
              </a>
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                Start a Pickup Order
              </a>
            </div>
          </div>
        </section>

        {/* Prose */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              A Sweeter Way to Gather in Evansville
            </h2>
            <p>
              Every great event needs a moment that gets people talking, and few
              things do it like ice cream. Cobblestone Creamery helps Evansville
              businesses, couples, and organizers add that moment to their
              gatherings. We are a locally owned creamery on Main Street, and we
              bring the same premium ice cream, loaded sundaes, and signature
              milkshakes that fill our downtown shop to the events that matter to
              you. Whether it is a Tuesday-afternoon pick-me-up for the office or
              a wedding dessert table that guests will photograph, we are glad to
              help you plan it.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Built for Offices, Corporate Events, and Weddings
            </h2>
            <p>
              For workplaces, an ice cream spread is one of the easiest ways to
              say thank you. Employee appreciation days, team milestones, summer
              afternoons, and client lunches all get better with sundaes and
              shakes in the room. For corporate events and downtown functions, a
              curated selection of scoops and toppings keeps things simple while
              still feeling special. And for weddings, showers, and milestone
              celebrations, a dessert table stocked with premium ice cream,
              floats, and cobbler bowls gives guests a fun alternative or a sweet
              companion to the cake.
            </p>
            <p>
              Because our flavor lineup rotates and our treats are prepared fresh
              to order, we will talk through your headcount, your date, and the
              kinds of desserts your guests will love. Signature milkshakes and
              sundaes are prepared fresh to order, fresh waffle cones are pressed
              to order, and we carry dairy-free options so more of your guests
              can join in. The result is a spread that feels made for your event
              rather than pulled off a shelf.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              How to Get Started
            </h2>
            <p>
              Planning is simple. Give us a call at{' '}
              <a href="tel:+18124999866" className="text-primary hover:text-gold transition-colors font-medium">(812) 499-9866</a>{' '}
              to talk through the details, or{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">order ice cream for pickup</a>{' '}
              if a large to-go order fits your gathering. You can also{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>{' '}
              to pick your favorites,{' '}
              <Link href="/about" className="text-primary hover:text-gold transition-colors font-medium">learn more about our locally owned shop</Link>, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>.
              We proudly serve Evansville and the wider Southern Indiana
              tri-state area, including Newburgh, Boonville, and nearby Henderson
              and Owensboro in Kentucky.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Plan Your Event With Us
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
              Catering FAQs
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
              Let&apos;s Make Your Evansville Event Sweeter
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Call us to talk through your office party, corporate event, or
              wedding, or start a large pickup order online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+18124999866"
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Call Now
              </a>
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
