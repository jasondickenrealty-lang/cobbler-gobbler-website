import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ORDER_ONLINE_URL } from '@/lib/links';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero with video background */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Cobblestone Creamery logo"
              className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
              Cobblestone Creamery
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto drop-shadow">
              Handcrafted ice cream and classic cobblers, made fresh daily
              with premium ingredients. Family owned since 2010.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-primary text-white px-8 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                Monthly Flavors
              </Link>
              <a
                href={ORDER_ONLINE_URL}
                className="bg-gold text-white px-8 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Online
              </a>
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

        {/* Monthly Game Promo */}
        <section className="bg-gradient-to-br from-primary to-dark overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl">&#127922;</div>
            <div className="absolute bottom-4 right-12 text-6xl">&#127881;</div>
            <div className="absolute top-1/2 left-1/3 text-4xl">&#11088;</div>
          </div>
          <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <p className="text-gold uppercase tracking-widest text-sm font-medium mb-3">Monthly Game</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Play & Win!
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Every order comes with a chance to play our monthly game. Win discounts, free treats, and bonus loyalty points!
            </p>
            <a
              href={ORDER_ONLINE_URL}
              className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
            >
              Order Now to Play
            </a>
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
            <a
              href={ORDER_ONLINE_URL}
              className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
            >
              Order Online
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
