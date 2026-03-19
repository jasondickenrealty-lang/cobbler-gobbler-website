import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ORDER_ONLINE_URL } from '@/lib/links';

/* SEO: FAQ structured data for rich snippets in Google search results */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is Cobblestone Creamery located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cobblestone Creamery is located at 900 Main Street in downtown Evansville, Indiana 47708. We are in the heart of downtown Evansville, easily accessible from all parts of the city.',
      },
    },
    {
      '@type': 'Question',
      name: 'What desserts do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We serve handcrafted ice cream in fresh waffle cones, signature milkshakes, ice cream sundaes, bowls, classic cobblers, and more. All of our desserts are made fresh daily with premium ingredients at our Evansville, Indiana ice cream shop.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you make fresh waffle cones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our waffle cones are made fresh in-house every day. You can smell them baking as soon as you walk into our downtown Evansville ice cream shop. We offer classic waffle cones, sugar cones, and waffle bowls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I order ice cream online in Evansville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can order online for pickup at order.cobblestonecreamery.com. Skip the line and have your favorite ice cream, milkshakes, and desserts ready when you arrive at our downtown Evansville location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you serve milkshakes in Evansville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Cobblestone Creamery serves thick, handcrafted milkshakes in downtown Evansville, Indiana. Choose from classic flavors or build your own with any of our premium ice cream flavors and mix-ins.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Cobblestone Creamery one of the best ice cream spots in Evansville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cobblestone Creamery stands out in Evansville for our daily-made waffle cones, small-batch ice cream with rotating monthly flavors, handcrafted milkshakes, classic cobblers, and a welcoming atmosphere in the heart of downtown Evansville. We use premium ingredients and put care into every scoop.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are your hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cobblestone Creamery is open Monday through Thursday 11am–9pm, Friday and Saturday 11am–10pm, and Sunday 12pm–8pm. We are located at 900 Main Street, Evansville, IN 47708.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* SEO: FAQ schema markup for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* Hero with video background */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/logo.png"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            {/* SEO: Logo with keyword-rich ALT tag */}
            <Image
              src="/logo.png"
              alt="Cobblestone Creamery downtown Evansville ice cream shop"
              className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8 object-contain"
              width={320}
              height={320}
              priority
            />
            {/* SEO: H1 with primary local keyword */}
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
              Ice Cream Shop in Evansville, Indiana
            </h1>
            {/* SEO: Intro paragraph with secondary keywords */}
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto drop-shadow">
              Handcrafted ice cream, fresh waffle cones, thick milkshakes, and
              classic cobblers made daily with premium ingredients in the heart
              of downtown Evansville, Indiana.
            </p>
            {/* SEO: Internal links to key pages */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-primary text-white px-8 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View Monthly Flavors
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

        {/* SEO: H2 sections targeting "waffle cones Evansville", "milkshakes Evansville", "desserts Evansville" */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-16">
              What Makes Us Special
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {/* SEO: "waffle cones Evansville" keyword section */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">01</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Fresh Waffle Cones</h3>
                <p className="text-dark/60 leading-relaxed">
                  Our waffle cones are made fresh in-house every single day. Crispy,
                  golden, and warm — the perfect vessel for our handcrafted ice cream
                  right here in Evansville, Indiana.
                </p>
              </div>
              {/* SEO: "milkshakes Evansville" keyword section */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">02</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Signature Milkshakes</h3>
                <p className="text-dark/60 leading-relaxed">
                  Thick, creamy milkshakes blended with our handcrafted ice cream and
                  premium toppings. From classic vanilla to seasonal specials — the best
                  milkshakes in Evansville.
                </p>
              </div>
              {/* SEO: "desserts Evansville" keyword section */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center">
                  <span className="text-gold text-lg font-serif">03</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Ice Cream Bowls &amp; Sundaes</h3>
                <p className="text-dark/60 leading-relaxed">
                  Build your perfect bowl or sundae with scoops of our daily-churned
                  ice cream and a variety of fresh toppings. The ultimate dessert
                  experience in downtown Evansville.
                </p>
              </div>
            </div>
            {/* SEO: Internal link to full menu */}
            <div className="text-center mt-12">
              <Link
                href="/menu"
                className="inline-block text-sm font-medium tracking-wide uppercase text-primary border-b-2 border-gold pb-1 hover:text-gold transition-colors"
              >
                See Our Full Menu
              </Link>
            </div>
          </div>
        </section>

        {/* Story Teaser — SEO: local keyword reinforcement */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">Our Story</h2>
            <p className="text-dark/60 leading-relaxed mb-8 text-lg">
              Established in 2026 by two friends with a love of ice cream, cows, and
              community, Cobblestone Creamery was built to be a welcoming dessert shop
              in downtown Evansville for great flavor, good company, and moments worth sharing.
            </p>
            <Link
              href="/about"
              className="inline-block text-sm font-medium tracking-wide uppercase text-primary border-b-2 border-gold pb-1 hover:text-gold transition-colors"
            >
              Read Our Full Story
            </Link>
          </div>
        </section>

        {/* Fundraising & Donations */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
                  Fundraising &amp; Donations
                </h2>
                <p className="text-dark/60 leading-relaxed mb-6">
                  Partner with Cobblestone Creamery for your next fundraiser! We
                  support schools, churches, sports teams, and local organizations
                  throughout Evansville. Host a fundraising night or request a
                  donation for your event.
                </p>
                <Link
                  href="/fundraising"
                  className="inline-block bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
                >
                  Learn More
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-cream rounded-lg p-5">
                  <span className="text-2xl block mb-2">&#127979;</span>
                  <p className="text-dark/70 text-sm font-medium">Schools</p>
                </div>
                <div className="bg-cream rounded-lg p-5">
                  <span className="text-2xl block mb-2">&#9917;</span>
                  <p className="text-dark/70 text-sm font-medium">Sports Teams</p>
                </div>
                <div className="bg-cream rounded-lg p-5">
                  <span className="text-2xl block mb-2">&#9962;</span>
                  <p className="text-dark/70 text-sm font-medium">Churches</p>
                </div>
                <div className="bg-cream rounded-lg p-5">
                  <span className="text-2xl block mb-2">&#128153;</span>
                  <p className="text-dark/70 text-sm font-medium">Nonprofits</p>
                </div>
              </div>
            </div>
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
              Play &amp; Win!
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

        {/* SEO: "Visit Us in Downtown Evansville" section with address, phone, and hours */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
              Visit Us in Downtown Evansville
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="font-serif text-xl text-primary mb-4">Location &amp; Contact</h3>
                {/* SEO: NAP (Name, Address, Phone) consistency for local search */}
                <address className="not-italic text-dark/70 leading-relaxed space-y-2">
                  <p className="font-medium text-dark">Cobblestone Creamery</p>
                  <p>900 Main Street</p>
                  <p>Evansville, Indiana 47708</p>
                  <p className="pt-2">
                    <a href="tel:+18122053322" className="text-primary hover:text-gold transition-colors font-medium">
                      (812) 205-3322
                    </a>
                  </p>
                </address>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/location"
                    className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors text-center"
                  >
                    Get Directions
                  </Link>
                  <a
                    href={ORDER_ONLINE_URL}
                    className="inline-block bg-gold text-white px-6 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors text-center"
                  >
                    Order for Pickup
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-primary mb-4">Hours</h3>
                <div className="text-dark/70 leading-relaxed space-y-1">
                  <p><span className="font-medium text-dark">Monday – Thursday:</span> 11:00 AM – 9:00 PM</p>
                  <p><span className="font-medium text-dark">Friday – Saturday:</span> 11:00 AM – 10:00 PM</p>
                  <p><span className="font-medium text-dark">Sunday:</span> 12:00 PM – 8:00 PM</p>
                </div>
                <p className="mt-6 text-dark/60 text-sm leading-relaxed">
                  Located in the heart of downtown Evansville, Indiana — just steps
                  from Main Street shops and restaurants. Stop by for the best ice cream,
                  milkshakes, and desserts in Evansville!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO: FAQ section with keyword-rich answers — also marked up with FAQPage schema above */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Where is Cobblestone Creamery located?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  Cobblestone Creamery is located at 900 Main Street in downtown
                  Evansville, Indiana 47708. We&apos;re in the heart of downtown Evansville,
                  easily accessible from all parts of the city.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  What desserts do you serve?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  We serve handcrafted ice cream in fresh waffle cones, signature milkshakes,
                  ice cream sundaes, bowls, classic cobblers, and more. All of our desserts
                  are made fresh daily with premium ingredients at our Evansville ice cream shop.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Do you make fresh waffle cones?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  Yes! Our waffle cones are made fresh in-house every day. You can smell them
                  baking as soon as you walk into our downtown Evansville ice cream shop.
                  We offer classic waffle cones, sugar cones, and waffle bowls.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Can I order ice cream online in Evansville?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  Yes! You can{' '}
                  <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold underline transition-colors">
                    order online for pickup
                  </a>{' '}
                  and have your favorite ice cream, milkshakes, and desserts ready when
                  you arrive at our downtown Evansville location.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  Do you serve milkshakes in Evansville?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  Yes! We serve thick, handcrafted milkshakes in downtown Evansville, Indiana.
                  Choose from classic flavors or build your own with any of our premium ice cream
                  flavors and mix-ins.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  What makes Cobblestone Creamery one of the best ice cream spots in Evansville?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  We stand out in Evansville for our daily-made waffle cones, small-batch ice cream
                  with rotating monthly flavors, handcrafted milkshakes, classic cobblers, and a
                  welcoming atmosphere in the heart of downtown. We use premium ingredients and put
                  care into every scoop.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary mb-2">
                  What are your hours?
                </h3>
                <p className="text-dark/60 leading-relaxed">
                  We&apos;re open Monday–Thursday 11am–9pm, Friday–Saturday 11am–10pm, and
                  Sunday 12pm–8pm. Visit Cobblestone Creamery at 900 Main Street, Evansville, IN 47708.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order CTA — SEO: reinforces "ice cream Evansville" + internal link */}
        <section className="bg-primary">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Skip the Line
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Order ahead for pickup from our downtown Evansville ice cream shop
              and have your favorites ready when you arrive.
            </p>
            <a
              href={ORDER_ONLINE_URL}
              className="inline-block bg-gold text-white px-10 py-3.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
            >
              Order Ice Cream Online
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
