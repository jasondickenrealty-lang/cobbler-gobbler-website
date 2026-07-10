import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'Best Ice Cream in Evansville, IN | Cobblestone Creamery — 900 Main St',
  description:
    'Cobblestone Creamery is the best ice cream shop in Evansville, Indiana. Premium ice cream, fresh waffle cones, classic cobblers, thick milkshakes, and sundaes at 900 Main Street in downtown Evansville. Open 7 days a week — order online for pickup!',
  alternates: {
    canonical: `${SITE_URL}/ice-cream-evansville-in`,
  },
  openGraph: {
    title: 'Best Ice Cream in Evansville, IN | Cobblestone Creamery — 900 Main St',
    description:
      'Premium ice cream, fresh waffle cones, cobblers, and milkshakes in downtown Evansville, Indiana. Visit Cobblestone Creamery at 900 Main Street or order online for pickup. Open 7 days a week!',
    url: `${SITE_URL}/ice-cream-evansville-in`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Best ice cream in Evansville, IN — Cobblestone Creamery at 900 Main Street' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Ice Cream in Evansville, IN | Cobblestone Creamery',
    description:
      'Premium ice cream, waffle cones, milkshakes & cobblers at 900 Main Street in downtown Evansville, IN. Open 7 days a week — order online for pickup!',
    images: ['/logo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Ice Cream in Evansville, IN', item: `${SITE_URL}/ice-cream-evansville-in` },
  ],
};

const FAQ_ITEMS = [
  {
    question: 'Where is Cobblestone Creamery located?',
    answer:
      'We are located at 900 Main Street in downtown Evansville, Indiana 47708. We are easy to find right on Main Street in the heart of downtown.',
  },
  {
    question: 'What are your hours?',
    answer:
      'We are open Monday through Thursday from 11am to 9pm, Friday and Saturday from 11am to 10pm, and Sunday from 12pm to 8pm.',
  },
  {
    question: 'Can I order ice cream online for pickup?',
    answer:
      'Yes! You can place an order online through our website and pick it up at our downtown Evansville location. Just visit our Order Online page to get started.',
  },
  {
    question: 'Do you serve anything besides ice cream?',
    answer:
      'Absolutely! In addition to our premium ice cream, we serve classic cobblers with seasonal fruits, thick milkshakes, sundaes, and other delicious desserts.',
  },
  {
    question: 'Do you offer a free kids scoop?',
    answer:
      'Yes! Download one of our coloring pages from the Free Kids Scoop page, color it at home, and bring it in for a free kids scoop of ice cream.',
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

export default function IceCreamEvansvillePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Ice Cream in Evansville, IN
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Cobblestone Creamery is a locally owned ice cream shop in downtown
              Evansville, Indiana, serving premium ice cream, classic
              cobblers, thick milkshakes, and seasonal desserts made
              with premium ingredients.
            </p>
          </div>
        </section>

        {/* Why Locals Love Us */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Why Evansville Loves Cobblestone Creamery
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-serif text-xl text-primary mb-3">Premium Ice Cream</h3>
                <p className="text-dark/60 leading-relaxed">
                  We serve premium ice cream in bold, creative flavors at our
                  downtown Evansville shop. Made with premium ingredients, our
                  scoops keep Evansville coming back for more.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-primary mb-3">Classic Cobblers &amp; Milkshakes</h3>
                <p className="text-dark/60 leading-relaxed">
                  Beyond our scoops, we bake traditional cobblers with seasonal
                  fruits and buttery crusts, and blend thick milkshakes that
                  keep people coming back for more.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-primary mb-3">Family-Friendly Fun</h3>
                <p className="text-dark/60 leading-relaxed">
                  From our free kids scoop coloring page program to our monthly
                  games with prizes, Cobblestone Creamery is a place where
                  families in Evansville create sweet memories together.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-primary mb-3">Community First</h3>
                <p className="text-dark/60 leading-relaxed">
                  Founded by two friends who love Evansville, we are rooted in
                  this community. We believe great desserts bring people
                  together and make our downtown a better place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Menu Items */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-4 text-center">
              What We Serve
            </h2>
            <p className="text-dark/50 text-center mb-10 max-w-xl mx-auto">
              Our menu rotates monthly with creative new flavors alongside
              beloved classics. Here are some favorites.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: 'Premium Ice Cream', desc: 'Premium scoops in rotating and classic flavors.' },
                { name: 'Classic Cobblers', desc: 'Warm, fruit-filled cobblers with buttery crusts baked in-house.' },
                { name: 'Thick Milkshakes', desc: 'Rich, creamy milkshakes blended with your favorite ice cream flavor.' },
                { name: 'Sundaes', desc: 'Build your own with house-made toppings, sauces, and whipped cream.' },
                { name: 'Waffle Cones', desc: 'Freshly pressed cones made in-store with a warm, sweet crunch.' },
                { name: 'Seasonal Specials', desc: 'Limited-time flavors and treats that celebrate each season.' },
              ].map((item) => (
                <div key={item.name} className="bg-white rounded-lg p-6 border border-gold/20">
                  <h3 className="font-serif text-lg text-primary mb-2">{item.name}</h3>
                  <p className="text-dark/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </section>

        {/* Downtown Location */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">
              Find Us in Downtown Evansville
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <address className="not-italic text-dark/70 space-y-3">
                  <p className="font-serif text-xl text-primary">Cobblestone Creamery</p>
                  <p>900 Main Street</p>
                  <p>Evansville, Indiana 47708</p>
                  <p className="pt-2">
                    <a href="tel:8122053322" className="text-primary hover:text-gold transition-colors font-medium">
                      (812) 205-3322
                    </a>
                  </p>
                  <p>
                    <a href="mailto:info@cobblestonecreamery.com" className="text-primary hover:text-gold transition-colors">
                      info@cobblestonecreamery.com
                    </a>
                  </p>
                </address>
                <div className="mt-6 space-y-2 text-dark/70">
                  <p className="font-medium text-dark">Hours:</p>
                  <p>Monday &ndash; Thursday: 11am &ndash; 9pm</p>
                  <p>Friday &ndash; Saturday: 11am &ndash; 10pm</p>
                  <p>Sunday: 12pm &ndash; 8pm</p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/location"
                    className="inline-block bg-primary text-white px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors text-center"
                  >
                    Get Directions
                  </Link>
                  <a
                    href={ORDER_ONLINE_URL}
                    className="inline-block bg-gold text-white px-6 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors text-center"
                  >
                    Order Online
                  </a>
                </div>
              </div>
              <div className="bg-cream rounded-lg overflow-hidden border border-dark/5">
                <iframe
                  title="Cobblestone Creamery location in downtown Evansville, IN"
                  src={`https://www.google.com/maps?q=${encodeURIComponent('900 Main Street, Evansville, Indiana 47708')}&output=embed`}
                  className="w-full h-72 md:h-full min-h-[280px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-3xl font-serif text-primary mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-6 border border-gold/20">
                  <h3 className="font-serif text-lg text-primary mb-2">{item.question}</h3>
                  <p className="text-dark/60 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order CTA */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Ready for the Best Ice Cream in Evansville?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Order ahead for pickup or stop by our downtown Evansville shop.
              We can&apos;t wait to scoop something special for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Ice Cream Online
              </a>
              <Link
                href="/location"
                className="inline-block border border-white/30 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
