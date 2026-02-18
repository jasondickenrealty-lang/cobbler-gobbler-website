import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6 leading-tight">
              Cobblestone Creamery
            </h1>
            <p className="text-lg md:text-xl text-dark/70 mb-10 max-w-xl mx-auto">
              Handcrafted ice cream and classic cobblers, made fresh daily
              with premium ingredients. Family owned since 2010.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-primary text-white px-8 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View Our Menu
              </Link>
              <Link
                href="/order"
                className="bg-gold text-white px-8 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Online
              </Link>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-16">
              What Makes Us Special
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">01</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Fresh Daily</h3>
                <p className="text-dark/60 leading-relaxed">
                  Every batch is crafted from scratch each morning using premium,
                  locally sourced ingredients.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">02</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Classic Cobblers</h3>
                <p className="text-dark/60 leading-relaxed">
                  Traditional recipes passed down through generations,
                  baked fresh with seasonal fruits and buttery crusts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">03</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Family Owned</h3>
                <p className="text-dark/60 leading-relaxed">
                  Locally owned and operated with love. We believe great food
                  brings people together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Teaser */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">Our Story</h2>
            <p className="text-dark/60 leading-relaxed mb-8 text-lg">
              What started as a small family dream in 2010 has grown into a beloved
              local destination. We pour our hearts into every scoop and every cobbler,
              using only the finest ingredients to create treats worth sharing.
            </p>
            <Link
              href="/about"
              className="inline-block text-sm font-medium tracking-wide uppercase text-primary border-b-2 border-gold pb-1 hover:text-gold transition-colors"
            >
              Read Our Full Story
            </Link>
          </div>
        </section>

        {/* Order CTA */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Skip the Line
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Order ahead for pickup or delivery and have your favorites ready when you arrive.
            </p>
            <Link
              href="/order"
              className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
            >
              Order Online
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
