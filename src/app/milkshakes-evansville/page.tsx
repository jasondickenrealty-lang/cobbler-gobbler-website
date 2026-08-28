import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Milkshakes in Evansville, IN | Signature Shakes at Cobblestone Creamery',
  description:
    'Craving a thick, creamy milkshake in Evansville? Cobblestone Creamery blends signature milkshakes and floats to order at 900 Main Street in downtown Evansville, IN. Order online for pickup or stop by seven days a week.',
  alternates: {
    canonical: `${SITE_URL}/milkshakes-evansville`,
  },
  openGraph: {
    title: 'Milkshakes in Evansville, IN | Cobblestone Creamery Signature Shakes',
    description:
      'Signature milkshakes and floats blended to order with premium ice cream at 900 Main Street in downtown Evansville, Indiana. Order online for pickup!',
    url: `${SITE_URL}/milkshakes-evansville`,
    images: [{ url: '/menu-cones/oreo.png', width: 800, height: 800, alt: 'Signature milkshake at Cobblestone Creamery in Evansville, IN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milkshakes in Evansville, IN | Cobblestone Creamery',
    description:
      'Thick, signature milkshakes and floats blended to order in downtown Evansville, IN. Order online for pickup or visit us seven days a week.',
    images: ['/menu-cones/oreo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Milkshakes in Evansville, IN', item: `${SITE_URL}/milkshakes-evansville` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Milkshakes in Evansville, IN',
  url: `${SITE_URL}/milkshakes-evansville`,
  description:
    'Signature milkshakes and floats blended to order with premium ice cream at Cobblestone Creamery, 900 Main Street in downtown Evansville, Indiana.',
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
    question: 'What kind of milkshakes does Cobblestone Creamery make?',
    answer:
      'We blend signature milkshakes to order using premium ice cream. You can build a shake around classic flavors like Vanilla Bean, Chocolate, Cookies and Cream, Cake Batter, and more, then add the toppings you love. We also serve floats for anyone who wants that fizzy soda-and-ice-cream combination.',
  },
  {
    question: 'Can I order a milkshake online for pickup in Evansville?',
    answer:
      'Yes. You can place your milkshake order online and pick it up at our downtown Evansville shop at 900 Main Street. Ordering ahead is the fastest way to skip the wait on a busy night near the Ford Center.',
  },
  {
    question: 'Do you offer dairy-free milkshake options?',
    answer:
      'We carry dairy-free options on our menu. Because our lineup rotates, the best way to confirm what is available on a given day is to check the full menu or give us a call at (812) 499-9866.',
  },
  {
    question: 'Where do I find you for a milkshake in downtown Evansville?',
    answer:
      'Cobblestone Creamery is located inside Main Street Food & Beverage at 900 Main Street, Evansville, IN 47708, near the Ford Center and the heart of downtown Main Street.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function MilkshakesEvansvillePage() {
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
              Signature Milkshakes in Evansville, IN
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              At Cobblestone Creamery, every milkshake is blended thick and
              creamy to order using premium ice cream. Stop by our downtown
              Evansville shop at 900 Main Street or order ahead for pickup and
              taste why locals make the trip for a shake.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order a Shake Online
              </a>
              <Link
                href="/menu"
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View the Full Ice Cream Menu
              </Link>
            </div>
          </div>
        </section>

        {/* Prose section */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              Milkshakes Blended Fresh to Order
            </h2>
            <p>
              A good milkshake is all about the pour, the thickness, and the
              flavor you build it from. At Cobblestone Creamery, we take our
              time. Each signature milkshake is prepared fresh to order, so the
              shake you carry out to Main Street tastes the way a shake is
              supposed to: cold, rich, and thick enough to make the straw work
              for it. We start with premium ice cream and blend to a texture
              that holds up on the walk back to the Ford Center or a stroll
              through downtown Evansville.
            </p>
            <p>
              Because our scoop lineup rotates, your milkshake can taste
              different every visit. Fans of the classics reach for Vanilla
              Bean and Chocolate. Anyone chasing nostalgia goes for Cake Batter
              or Cookies and Cream. If you like a little more going on, ask
              about building a shake around Triple Peanut Butter Cup or Mint
              Chocolate Chip. Add whipped topping, sauces, or a swirl of your
              favorite mix-in and you have a dessert that feels custom-made,
              because it is.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              More Than a Shake
            </h2>
            <p>
              Milkshakes are just the start. If you love the shake, you will
              want to explore the rest of our downtown Evansville dessert
              lineup. We serve floats for that classic fizz-meets-cream combo,
              loaded sundaes for the table that cannot decide, cobbler bowls
              for a warm-and-cold contrast, and fresh waffle cones pressed to
              order when you would rather keep it simple. Bring a friend, order
              a couple of shakes, and split a sundae down the middle.
            </p>
            <p>
              We are a locally owned creamery that opened in 2026 inside Main
              Street Food &amp; Beverage, and we serve Evansville along with the
              wider Southern Indiana tri-state area, including Newburgh,
              Boonville, and nearby Henderson and Owensboro across the river in
              Kentucky. Whether you are downtown for an event or just want the
              best milkshake in town, we are an easy stop. When you are ready,{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">order ice cream for pickup</a>,{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Where to Get a Milkshake in Downtown Evansville
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
              Milkshake FAQs
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
              Ready for a Thick, Creamy Shake?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Order a signature milkshake online for pickup or stop by our
              downtown Evansville shop. We will blend it fresh to order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Online
              </a>
              <Link
                href="/menu"
                className="inline-block border border-white/30 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                View Menu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
