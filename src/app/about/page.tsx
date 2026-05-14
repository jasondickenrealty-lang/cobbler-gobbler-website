import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

const SITE_URL = 'https://cobblestonecreamery.com';

export const metadata: Metadata = {
  title: 'About Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
  description:
    'Learn the story behind Cobblestone Creamery — a locally owned ice cream shop at 900 Main Street in downtown Evansville, Indiana. Handcrafted desserts, fresh waffle cones, milkshakes, and cobblers made daily since 2026.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Cobblestone Creamery | Locally Owned Ice Cream Shop in Evansville, IN',
    description:
      'Cobblestone Creamery is a community-focused ice cream shop in downtown Evansville, Indiana. Founded in 2026. Fresh waffle cones, handcrafted scoops, milkshakes, and classic cobblers.',
    url: `${SITE_URL}/about`,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Cobblestone Creamery neighborhood ice cream shop in Evansville, Indiana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Cobblestone Creamery | Ice Cream Shop in Evansville, IN',
    description:
      'Locally owned ice cream shop in downtown Evansville, Indiana — handcrafted desserts, fresh waffle cones, milkshakes, and classic cobblers since 2026.',
    images: ['/logo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">About Cobblestone Creamery</h1>
            <p className="text-dark/60 text-lg">
              A locally owned ice cream shop at 900 Main Street in downtown Evansville, Indiana — established in
              2026 by two friends with a love of handcrafted desserts, fresh waffle cones, and community.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">How It All Began</h2>
            <p className="text-dark/70 leading-relaxed mb-6">
              Cobblestone Creamery started in 2026 when two longtime friends decided to turn
              their shared dream into something real: a neighborhood ice cream shop in Evansville
              built on joy, quality, and a little small-town charm. Located at 900 Main Street in
              the heart of downtown Evansville, Indiana, we set out to create a community gathering
              spot where every visit feels like coming home.
            </p>
            <p className="text-dark/70 leading-relaxed mb-6">
              Inspired by weekend farm drives, old-fashioned scoop shops, and a serious obsession
              with creamy flavors, they created a place where everyone feels welcome. From handcrafted
              ice cream and fresh waffle cones pressed hot off the iron to thick milkshakes and classic
              cobblers baked fresh, every item on our menu is made with care using premium ingredients.
              Around here, we don&apos;t rush good ice cream: we like to moo-ve at the pace of great flavor.
            </p>
            <p className="text-dark/70 leading-relaxed">
              Downtown Evansville deserves a dessert shop with real personality, and that is exactly
              what Cobblestone Creamery was built to be. We are open seven days a week at{' '}
              <Link href="/location" className="text-primary hover:text-gold underline transition-colors">
                900 Main Street
              </Link>
              , and you can always{' '}
              <a href="https://order.cobblestonecreamery.com" className="text-primary hover:text-gold underline transition-colors">
                order online for pickup
              </a>
              {' '}so your favorite scoops are ready when you walk in.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-cream">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">What We Stand For</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  Small-batch, handcrafted ice cream and desserts made with thoughtful ingredients,
                  bold flavors, and plenty of creativity — right here in Evansville, Indiana.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  A welcoming, community-focused shop in downtown Evansville where friends, families,
                  and first-timers can gather, laugh, and leave happier than they arrived.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  A commitment to community partnerships and local spirit because,
                  honestly, that&apos;s where the herd heart is.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">Join Our Team</h2>
            <p className="text-dark/70 leading-relaxed mb-8">
              We&apos;re always looking for friendly, hardworking individuals to join our team
              at Cobblestone Creamery in downtown Evansville. If you&apos;re passionate about great
              food and excellent customer service, we&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/join-our-team"
                className="inline-block bg-primary text-white px-7 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                Fill Out Application
              </Link>
              <Link
                href="/menu"
                className="inline-block border border-primary text-primary px-7 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-white transition-colors"
              >
                View Our Menu
              </Link>
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-7 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
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
