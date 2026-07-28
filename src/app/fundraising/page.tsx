import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fundraising Nights & Donations | Cobblestone Creamery Evansville, IN',
  description:
    'Host a fundraising night at Cobblestone Creamery in Evansville, Indiana! We support schools, churches, youth sports teams, nonprofits, and local organizations. We donate a percentage of sales back to your cause. Call (812) 499-9866.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/fundraising',
  },
  openGraph: {
    title: 'Fundraising Nights & Donations | Cobblestone Creamery — Evansville, IN',
    description:
      'Partner with Cobblestone Creamery for your next fundraiser. Fundraising nights, gift card donations, and community support for Evansville-area schools, teams, and nonprofits.',
    url: 'https://cobblestonecreamery.com/fundraising',
    images: [{ url: '/assets/fundraising-flyer.png', width: 1024, height: 1536, alt: 'Cobblestone Creamery ice cream fundraising flyer for Evansville, Indiana organizations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fundraising Nights & Donations | Cobblestone Creamery Evansville, IN',
    description:
      'Host a fundraiser at Cobblestone Creamery — we donate a percentage of sales to your cause. Schools, sports teams, churches & nonprofits in Evansville, IN.',
    images: ['/assets/fundraising-flyer.png'],
  },
};

export default function FundraisingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Fundraising &amp; Donations
            </h1>
            <p className="text-dark/60 text-lg">
              Cobblestone Creamery is proud to support schools, churches, nonprofits, and
              community organizations throughout Evansville, Indiana. Let us help you raise
              funds for your cause — with ice cream!
            </p>
            <div className="mt-12 max-w-xl mx-auto">
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(10,31,68,0.14)] ring-1 ring-primary/10">
                <Image
                  src="/assets/fundraising-flyer.png"
                  alt="Cobblestone Creamery high-profit ice cream fundraising flyer"
                  width={1024}
                  height={1536}
                  priority
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-sm md:text-base text-dark/60">
                Share this flyer with your group to show how the fundraiser works and what your organization can raise.
              </p>
            </div>
          </div>
        </section>

        {/* Fundraising Nights */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mb-5">
                  <span className="text-gold text-lg font-serif">01</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-primary mb-4">
                  Fundraising Nights
                </h2>
                <p className="text-dark/60 leading-relaxed mb-4">
                  Host a fundraising night at Cobblestone Creamery! We&apos;ll donate a
                  percentage of all sales during your event back to your organization.
                  It&apos;s a fun, easy way to raise money while your supporters enjoy
                  premium ice cream.
                </p>
                <ul className="space-y-3 text-dark/70">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>We donate a percentage of sales during your event</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>Available any day of the week (subject to availability)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>We help promote your event on our social media</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>Perfect for schools, sports teams, churches, and clubs</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mb-5">
                  <span className="text-gold text-lg font-serif">02</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-primary mb-4">
                  Donation Requests
                </h2>
                <p className="text-dark/60 leading-relaxed mb-4">
                  Need a donation for a raffle, silent auction, or community event?
                  We&apos;re happy to consider gift card donations and product donations
                  for qualifying organizations in the Evansville area.
                </p>
                <ul className="space-y-3 text-dark/70">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>Gift card donations for raffles and auctions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>Product donations for community events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>We prioritize local Evansville-area organizations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">&#10003;</span>
                    <span>Submit requests at least 3 weeks in advance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-14">
              How It Works
            </h2>
            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-serif text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">Reach Out</h3>
                  <p className="text-dark/60 leading-relaxed">
                    Email us at{' '}
                    <a href="mailto:info@cobblestonecreamery.com" className="text-primary hover:text-gold underline transition-colors">
                      info@cobblestonecreamery.com
                    </a>{' '}
                    or call{' '}
                    <a href="tel:+18124999866" className="text-primary hover:text-gold underline transition-colors">
                      (812) 499-9866
                    </a>{' '}
                    with your organization name, event details, and preferred date. For donation
                    requests, let us know what type of event you&apos;re hosting and how the
                    donation will be used.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-serif text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">We&apos;ll Coordinate</h3>
                  <p className="text-dark/60 leading-relaxed">
                    Our team will review your request and get back to you within a few business
                    days. For fundraising nights, we&apos;ll lock in your date and work out the
                    details. For donations, we&apos;ll let you know what we can provide.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-serif text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">Spread the Word</h3>
                  <p className="text-dark/60 leading-relaxed">
                    For fundraising nights, the more people who come out, the more your
                    organization raises! We&apos;ll help promote on our social media, and
                    we encourage you to share the event with your members, families, and friends.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-serif text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">Enjoy the Event</h3>
                  <p className="text-dark/60 leading-relaxed">
                    Show up, enjoy ice cream, and support a great cause. After the event,
                    we&apos;ll tally the results and get your organization its funds. It&apos;s
                    that simple.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Support */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-14">
              Organizations We Support
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: '\uD83C\uDFEB', label: 'Schools & PTAs' },
                { icon: '\u26BD', label: 'Youth Sports Teams' },
                { icon: '\u26EA', label: 'Churches & Faith Groups' },
                { icon: '\uD83D\uDC99', label: 'Nonprofits & Charities' },
                { icon: '\uD83C\uDFC5', label: 'Scouts & Clubs' },
                { icon: '\uD83C\uDFCB', label: 'Community Organizations' },
              ].map((item) => (
                <div key={item.label} className="bg-cream rounded-lg p-6">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <p className="text-dark/70 font-medium text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Let&apos;s Support Your Cause
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Ready to set up a fundraising night or submit a donation request?
              Get in touch and let&apos;s make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@cobblestonecreamery.com"
                className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:+18124999866"
                className="inline-block bg-white/10 text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-white/20 transition-colors border border-white/20"
              >
                Call (812) 499-9866
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
