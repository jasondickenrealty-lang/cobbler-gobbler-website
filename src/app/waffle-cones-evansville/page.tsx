import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=900+Main+Street+Evansville+Indiana+47708';

export const metadata: Metadata = {
  title: 'Fresh Waffle Cones in Evansville, IN | Cobblestone Creamery',
  description:
    'Fresh waffle cones pressed to order at Cobblestone Creamery in downtown Evansville, IN. Enjoy warm, crisp waffle cones, waffle bowls, and waffle nachos with premium ice cream at 900 Main Street. Order online for pickup.',
  alternates: {
    canonical: `${SITE_URL}/waffle-cones-evansville`,
  },
  openGraph: {
    title: 'Fresh Waffle Cones in Evansville, IN | Cobblestone Creamery',
    description:
      'Warm, crisp waffle cones pressed to order, plus waffle bowls and waffle nachos with premium ice cream at Cobblestone Creamery in downtown Evansville, IN.',
    url: `${SITE_URL}/waffle-cones-evansville`,
    images: [{ url: '/menu-cones/vanilla.jpg', width: 800, height: 800, alt: 'Fresh waffle cone pressed to order at Cobblestone Creamery in Evansville' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Waffle Cones in Evansville, IN | Cobblestone Creamery',
    description:
      'Warm, crisp waffle cones pressed to order, plus waffle bowls and waffle nachos in downtown Evansville, IN. Order online for pickup.',
    images: ['/menu-cones/vanilla.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Fresh Waffle Cones in Evansville, IN', item: `${SITE_URL}/waffle-cones-evansville` },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Fresh Waffle Cones in Evansville, IN',
  url: `${SITE_URL}/waffle-cones-evansville`,
  description:
    'Fresh waffle cones pressed to order, plus waffle bowls and waffle nachos with premium ice cream at Cobblestone Creamery, 900 Main Street in downtown Evansville, Indiana.',
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
    question: 'Are your waffle cones made fresh?',
    answer:
      'Yes. Our waffle cones are pressed to order, so they come off the iron warm and crisp with that unmistakable fresh-waffle aroma. Pair one with a scoop of premium ice cream for a treat that is hard to beat.',
  },
  {
    question: 'Do you offer waffle bowls too?',
    answer:
      'We do. If you want to load up on scoops and toppings, a waffle bowl gives you more room to build while keeping that fresh, crisp waffle base. We also serve waffle nachos for anyone who wants a shareable twist.',
  },
  {
    question: 'Can I get a waffle cone treat to go?',
    answer:
      'Absolutely. Stop by our shop at 900 Main Street in downtown Evansville, or order ahead online for pickup. Cones are best enjoyed soon after they are pressed, so a quick trip is the way to go.',
  },
  {
    question: 'What ice cream flavors go in a waffle cone?',
    answer:
      'Any of our featured and rotating flavors work beautifully, from Vanilla Bean and Chocolate to Superman and Cake Batter. Since flavors rotate, check the full menu for what is available today.',
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

export default function WaffleConesEvansvillePage() {
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
              Fresh Waffle Cones in Evansville, IN
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              There is nothing quite like a waffle cone pressed to order. At
              Cobblestone Creamery in downtown Evansville, we press ours warm and
              crisp, then fill them with premium ice cream. Stop by 900 Main
              Street or order ahead for pickup.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Ice Cream for Pickup
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

        {/* Prose */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 space-y-6 text-dark/70 leading-relaxed">
            <h2 className="text-3xl font-serif text-primary mb-2">
              Pressed to Order, Every Time
            </h2>
            <p>
              A great waffle cone is a small piece of theater. The batter hits a
              hot iron, the kitchen fills with that warm, sweet smell, and a
              minute later you are holding a cone that is crisp on the outside and
              still faintly warm in your hand. At Cobblestone Creamery, that is
              exactly how we do it. Our fresh waffle cones are pressed to order,
              not pulled from a bag, which is the difference between a cone that
              is just a vehicle for ice cream and one that is part of the treat
              itself. Downtown Evansville has plenty of ways to enjoy dessert, and
              a freshly pressed waffle cone is one of the simplest and most
              satisfying.
            </p>
            <p>
              Fill it with any of our featured or rotating flavors and you have a
              classic. Vanilla Bean keeps it timeless, Chocolate goes rich,
              Superman brings the color and the nostalgia, and Cake Batter turns
              it into a celebration. Because our flavors rotate, the cone you love
              today can be an entirely new experience next week, which is a good
              reason to keep coming back.
            </p>
            <h2 className="text-3xl font-serif text-primary pt-4 mb-2">
              Waffle Bowls and Waffle Nachos, Too
            </h2>
            <p>
              If a single cone is not enough real estate for your ambitions, we
              have you covered. A fresh waffle bowl gives you room to stack extra
              scoops, pile on toppings, and drizzle your favorite sauces while
              keeping that same crisp, fresh waffle base. For something built to
              share, waffle nachos take the fresh waffle you love and turn it into
              a treat the whole table can dig into. Between cones, bowls, and
              nachos, our fresh-pressed waffle lineup has a shape for every
              appetite.
            </p>
            <p>
              We are a locally owned creamery that opened in 2026, tucked inside
              Main Street Food &amp; Beverage near the Ford Center. We serve
              Evansville along with the wider Southern Indiana tri-state area,
              including Newburgh, Boonville, and nearby Henderson and Owensboro in
              Kentucky. Ready for a fresh cone? You can{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">order ice cream for pickup</a>,{' '}
              <Link href="/menu" className="text-primary hover:text-gold transition-colors font-medium">view the full ice cream menu</Link>,{' '}
              <Link href="/about" className="text-primary hover:text-gold transition-colors font-medium">learn more about our shop</Link>, or{' '}
              <Link href="/location" className="text-primary hover:text-gold transition-colors font-medium">get directions to our downtown Evansville location</Link>.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Grab a Fresh Cone on Main Street
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
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors text-center"
                >
                  Get Directions
                </a>
                <a
                  href="tel:+18122053322"
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
              Waffle Cone FAQs
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
              Ready for a Warm, Fresh Waffle Cone?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Order ahead for pickup or stop by our downtown Evansville shop and
              we will press one to order.
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
