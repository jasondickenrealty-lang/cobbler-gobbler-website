import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Our Story — Neighborhood Ice Cream Shop in Evansville, IN',
  description:
    'Learn the story behind Cobblestone Creamery — a neighborhood ice cream shop in downtown Evansville, Indiana serving handcrafted desserts, milkshakes, and fresh waffle cones since 2026.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/about',
  },
  openGraph: {
    title: 'Our Story | Cobblestone Creamery — Evansville, IN',
    description:
      'A community-focused ice cream shop in downtown Evansville, Indiana. Founded in 2026 by two friends who love handcrafted desserts and community.',
    url: 'https://cobblestonecreamery.com/about',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery neighborhood ice cream shop in Evansville Indiana' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Story</h1>
            <p className="text-dark/60 text-lg">
              A neighborhood ice cream shop in downtown Evansville, Indiana — established in
              2026 by two friends with a love of handcrafted desserts, cows, and community.
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
              the heart of downtown Evansville, we set out to create a community gathering spot
              where every visit feels like coming home.
            </p>
            <p className="text-dark/70 leading-relaxed">
              Inspired by weekend farm drives, old-fashioned scoop shops, and a serious obsession
              with creamy flavors, they created a place where everyone feels welcome. From handcrafted
              ice cream and fresh waffle cones to thick milkshakes and classic cobblers, every item on
              our menu is made with care using premium ingredients. Around here,
              we don&apos;t rush good ice cream: we like to moo-ve at the pace of great flavor.
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
