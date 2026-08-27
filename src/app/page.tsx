import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import GoogleReviewsWidget from '@/components/GoogleReviewsWidget';
import { ORDER_ONLINE_URL } from '@/lib/links';
import { getSiteContent, hoursLines, hoursSentence, flavorAlt } from '@/lib/siteContent';

const faqItems = [
  {
    question: 'Where is Cobblestone Creamery located?',
    answer:
      'Cobblestone Creamery is located at 900 Main Street in downtown Evansville, Indiana 47708.',
  },
  {
    question: 'What desserts do you serve?',
    answer:
      'We serve premium ice cream, fresh waffle cones, signature milkshakes, loaded sundaes, waffle bowls, cobbler bowls, and rotating specials for pickup and walk-in guests.',
  },
  {
    question: 'Do you make fresh waffle cones?',
    answer:
      'Yes. Our waffle cones are made fresh in house and are one of the first things guests notice when they walk in.',
  },
  {
    question: 'Can I order online for pickup?',
    answer:
      'Yes. You can order online for pickup and have your desserts ready when you arrive at our downtown Evansville shop.',
  },
  {
    question: 'Do you support local fundraising nights?',
    answer:
      'Yes. We work with schools, sports teams, churches, and local groups that want to host fundraising events in Evansville.',
  },
  {
    question: 'What are your hours?',
    answer:
      'We are open Monday through Thursday from 11:00 AM to 2:00 PM and 4:00 PM to 9:00 PM, Friday from 11:00 AM to 2:00 PM and 4:00 PM to 10:00 PM, Saturday from 11:00 AM to 10:00 PM, and Sunday from 12:00 PM to 6:00 PM.',
  },
];

/**
 * The hours FAQ answer is written from the live config so it can never drift
 * from the hours shown further down the page (or in the footer). Everything
 * else in the list is static copy.
 */
function resolveFaqItems(hoursAnswer: string) {
  if (!hoursAnswer) return faqItems;
  return faqItems.map((item) =>
    item.question === 'What are your hours?' ? { ...item, answer: hoursAnswer } : item,
  );
}

function buildFaqJsonLd(items: typeof faqItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

const quickHits = [
  { label: 'Fresh At Cobblestone', value: 'Waffle Cones' },
  { label: 'Cobblestone Pickup', value: 'Fast Ordering' },
];

const experienceCards = [
  {
    title: 'Fresh Waffle Cones',
    description:
      'Hot irons, crisp edges, and the kind of smell that stops people on the sidewalk.',
    image: '/menu-cones/vanilla.jpg',
    alt: 'Vanilla ice cream cone from Cobblestone Creamery',
    href: '/menu',
    cta: 'See The Menu',
  },
  {
    title: 'Big Milkshake Energy',
    description:
      'Classic shakes, loaded toppings, and a sweeter version of the neighborhood clubhouse.',
    image: '/menu-cones/oreo.jpg',
    alt: 'Cookies and cream style dessert from Cobblestone Creamery',
    href: ORDER_ONLINE_URL,
    cta: 'Order A Shake',
    external: true,
  },
  {
    title: 'Cobblers And Sundaes',
    description:
      'Built for date night, post-game dessert runs, and everybody who wants more than one scoop.',
    image: '/menu-cones/cake-batter.png',
    alt: 'Cake batter dessert from Cobblestone Creamery',
    href: '/menu',
    cta: 'Browse Favorites',
  },
];

/**
 * House copy for the flavors that shipped with the site. The cards themselves
 * are driven by the owner-editable lineup now, so a flavor keeps its blurb if
 * it is still on the list, a new flavor uses whatever blurb the owner wrote,
 * and a flavor with neither just shows its name.
 */
const HOUSE_BLURBS: Record<string, string> = {
  'triple peanut butter cup': 'Rich, stacked, and built like a cleanup hitter.',
  'superman': 'Bright color, nostalgic flavor, and instant kid approval.',
  'strawberry': 'Classic scoop-shop sweetness with a little summer feel.',
  'mint chocolate chip': 'Cool, crisp, and one of the first tubs to disappear.',
  'vanilla bean': 'The one everything else gets measured against.',
  'chocolate': 'Deep, cold, and exactly what it promises.',
  'coffee': 'A little grown-up, a lot of reason to come back.',
  'butter pecan': 'Buttery, toasted, and quietly the regulars\' pick.',
};

const clubhouseNotes = [
  'Built in downtown Evansville for guests who want an ice cream shop with real personality.',
  'Easy online ordering for pickup when you want the line skipped and the treats ready.',
  'Fundraisers, giveaways, and rotating menu moments that keep the shop feeling active.',
];

const visitStats = [
  { label: 'Address', value: '900 Main Street' },
  { label: 'Call Ahead', value: '(812) 499-9866' },
  { label: 'Order Pickup', value: 'Fast Checkout' },
  { label: 'Open Late', value: 'Fri + Sat' },
];

export default async function HomePage() {
  const { hours, hoursNote, featuredFlavors } = await getSiteContent();

  // Four cards is what this layout is built for; the lineup can be longer.
  const fanFavorites = featuredFlavors.slice(0, 4).map((flavor) => ({
    ...flavor,
    blurb: flavor.blurb || HOUSE_BLURBS[flavor.name.toLowerCase()] || '',
  }));
  const hoursDisplay = hoursLines(hours);
  const resolvedFaqItems = resolveFaqItems(hoursSentence(hours));
  const faqJsonLd = buildFaqJsonLd(resolvedFaqItems);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <section className="relative isolate overflow-hidden border-b-4 border-gold bg-dark text-white">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="/logo.png"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,22,40,0.93)_0%,rgba(16,36,63,0.84)_42%,rgba(16,36,63,0.55)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(201,145,47,0.25),transparent_62%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_20%,transparent_80%,rgba(255,255,255,0.08))]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 md:pb-24 md:pt-24">
            <div className="grid gap-12">
              <div className="max-w-3xl">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/10 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-gold sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.34em]">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  Downtown Evansville Ice Cream Shop
                </p>

                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 p-2 shadow-[0_16px_32px_rgba(0,0,0,0.26)]">
                    <Image
                      src="/logo.png"
                      alt="Cobblestone Creamery logo"
                      width={88}
                      height={88}
                      className="h-full w-full rounded-full object-cover"
                      priority
                    />
                  </div>
                  <div className="h-px flex-1 bg-white/25" />
                </div>

                <h1 className="font-serif text-5xl uppercase leading-[0.95] tracking-[0.06em] text-chalk sm:text-6xl md:text-7xl">
                  Ice Cream, Milkshakes &amp; Desserts
                  <span className="block text-gold">in Downtown Evansville</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78] md:text-xl">
                  Cobblestone Creamery is where downtown Evansville comes for fresh
                  waffle cones, stacked milkshakes, loaded sundaes, and cobbler bowls —
                  inside Main Street Food &amp; Beverage at 900 Main Street. Walk in or
                  order ahead for fast pickup.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href={ORDER_ONLINE_URL}
                    className="inline-flex items-center justify-center rounded-full bg-dugout-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-200 hover:translate-y-[-1px] hover:bg-[#ca4438]"
                  >
                    Order Online
                  </a>
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    View Menu
                  </Link>
                </div>

                <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
                  {quickHits.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold/90">
                        {item.label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-dark/10 bg-cream">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">From The Cobblestone Counter</p>
              <h2 className="mt-2 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                Bigger Flavor.
                <span className="block text-dugout-red">Stronger Personality.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-dark/[0.72]">
                In downtown Evansville, every scoop, shake, and sundae is prepared fresh
                to order. Bold flavors, easy online pickup, and a dessert shop experience
                that feels like a neighborhood hangout, not a chain.
              </p>
            </div>
            <div className="grid gap-4">
              <a
                href={ORDER_ONLINE_URL}
                className="rounded-[1.75rem] border border-primary/[0.12] bg-white px-6 py-6 shadow-[0_16px_30px_rgba(16,36,63,0.08)] transition-transform duration-200 hover:translate-y-[-2px]"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-dugout-red">Pickup</p>
                <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                  Order Online
                </p>
                <p className="mt-3 text-sm leading-6 text-dark/70">
                  Build your order ahead of time and pick it up ready to go at 900 Main Street.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-light-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">What To Order At Cobblestone</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                The Cobblestone Dessert Counter
                <span className="block text-ballpark-blue">Feels Like The Main Event</span>
              </h2>
              <p className="mt-4 text-lg leading-8 text-dark/[0.72]">
                From waffle cones fresh off the iron to signature Cobblestone milkshakes
                loaded with toppings — every item on the menu is prepared fresh to order
                and built to be the best part of your day in downtown Evansville.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {experienceCards.map((card) => (
                <article
                  key={card.title}
                  className="group overflow-hidden rounded-[2rem] border border-dark/[0.08] bg-white shadow-[0_16px_34px_rgba(16,36,63,0.08)]"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(11,22,40,0.62)_100%)]" />
                    <p className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.28em] text-white backdrop-blur-sm">
                      Cobblestone Favorite
                    </p>
                  </div>
                  <div className="p-7">
                    <h3 className="font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-dark/[0.72]">{card.description}</p>
                    {card.external ? (
                      <a
                        href={card.href}
                        className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.22em] text-dugout-red transition-colors hover:text-primary"
                      >
                        {card.cta}
                      </a>
                    ) : (
                      <Link
                        href={card.href}
                        className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.22em] text-dugout-red transition-colors hover:text-primary"
                      >
                        {card.cta}
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-dark/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-dark/[0.08] bg-primary">
                <Image
                  src="/menu-cones/chocolate.jpeg"
                  alt="Chocolate ice cream dessert from Cobblestone Creamery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-[320px] flex-col justify-between rounded-[2rem] border border-dark/[0.08] bg-[linear-gradient(180deg,#10243f_0%,#1d466f_100%)] p-8 text-white shadow-[0_18px_36px_rgba(16,36,63,0.18)]">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gold">Our Story</p>
                  <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-chalk">
                    The Creamery
                    <span className="block text-gold">Clubhouse</span>
                  </h2>
                </div>
                <p className="text-base leading-7 text-white/[0.72]">
                  Cobblestone was built to feel less like a generic dessert counter and
                  more like a downtown spot people actually want to linger in.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Why Guests Choose Cobblestone</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                Built For Every
                <span className="block text-ballpark-blue">Downtown Visit</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-dark/[0.72]">
                Cobblestone Creamery is a downtown Evansville ice cream shop with real
                personality — premium scoops, easy online ordering for pickup, and a
                welcoming vibe that keeps families, date nights, and regulars coming
                back all season long.
              </p>
              <div className="mt-8 grid gap-4">
                {clubhouseNotes.map((note) => (
                  <div
                    key={note}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-dark/[0.08] bg-light-cream px-5 py-5"
                  >
                    <div className="mt-1 h-3 w-3 rounded-full bg-dugout-red" />
                    <p className="text-base leading-7 text-dark/[0.76]">{note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ballpark-blue"
                >
                  Read Our Story
                </Link>
                <Link
                  href="/fundraising"
                  className="inline-flex items-center justify-center rounded-full border border-primary/[0.15] bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:border-gold/60 hover:text-dugout-red"
                >
                  Plan A Fundraiser
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#10243f_0%,#173256_45%,#b33a2f_100%)] text-white">
          <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_52%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-gold">Cobblestone Promos + Community</p>
                <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-chalk md:text-5xl">
                  Family Deals &amp;
                  <span className="block text-gold">Community Nights</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/[0.76]">
                  From rewards for our regulars to community fundraising events —
                  there is always something happening at Cobblestone Creamery in
                  downtown Evansville, Indiana.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.8rem] border border-white/[0.14] bg-white/10 p-6 backdrop-blur-sm">
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Cobblestone Rewards</p>
                  <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                    Join Our Loyalty Program
                  </h3>
                  <p className="mt-3 text-base leading-7 text-white/[0.72]">
                    Earn points on qualifying purchases and unlock rewards. Sign up online or on the tablet in the shop.
                  </p>
                  <Link
                    href="/loyalty-signup"
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    Sign Up Free
                  </Link>
                </div>
                <div className="rounded-[1.8rem] border border-white/[0.14] bg-dark/[0.28] p-6 backdrop-blur-sm">
                  <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Cobblestone Community</p>
                  <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                    Cobblestone Community Nights
                  </h3>
                  <p className="mt-3 text-base leading-7 text-white/[0.72]">
                    Schools, sports teams, and local organizations can use the shop as a fundraiser driver.
                  </p>
                  <Link
                    href="/fundraising"
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    Start Planning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {fanFavorites.length > 0 && (
        <section className="bg-light-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Cobblestone Fan Favorites</p>
                <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                  Cobblestone Flavor Cards
                  <span className="block text-ballpark-blue">Worth Coming Back For</span>
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-dugout-red transition-colors hover:text-primary"
              >
                Browse The Full Menu
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {fanFavorites.map((item) => (
                <article
                  key={item.name}
                  className="overflow-hidden rounded-[2rem] border border-dark/[0.08] bg-white shadow-[0_16px_30px_rgba(16,36,63,0.08)]"
                >
                  <div className="relative h-64">
                    <Image src={item.image} alt={flavorAlt(item)} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                      {item.name}
                    </h3>
                    {item.blurb && (
                      <p className="mt-3 text-base leading-7 text-dark/[0.72]">{item.blurb}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        )}

        <section className="border-y border-dark/10 bg-white" id="visit-us">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="rounded-[2rem] border border-dark/[0.08] bg-[linear-gradient(180deg,#10243f_0%,#16355a_100%)] p-8 text-white shadow-[0_20px_40px_rgba(16,36,63,0.18)]">
                <p className="text-sm uppercase tracking-[0.32em] text-gold">Visit The Shop</p>
                <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-chalk md:text-5xl">
                  Come By For
                  <span className="block text-gold">Your Next Scoop</span>
                </h2>
                <address className="mt-8 not-italic space-y-3 text-base leading-7 text-white/[0.76]">
                  <p className="text-white">Cobblestone Creamery</p>
                  <p>900 Main Street</p>
                  <p>Evansville, Indiana 47708</p>
                  <p>
                    <a href="tel:+18124999866" className="transition-colors hover:text-gold">
                      (812) 499-9866
                    </a>
                  </p>
                </address>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/location"
                    className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-sand"
                  >
                    Get Directions
                  </Link>
                  <a
                    href={ORDER_ONLINE_URL}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    Order Pickup
                  </a>
                </div>
              </div>

              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {visitStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.75rem] border border-dark/[0.08] bg-light-cream px-5 py-5"
                    >
                      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-dugout-red">
                        {item.label}
                      </p>
                      <p className="mt-3 font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-dark/[0.08] bg-white p-6 shadow-[0_14px_26px_rgba(16,36,63,0.08)]">
                  <p className="text-sm uppercase tracking-[0.3em] text-dugout-red">Hours</p>
                  <div className="mt-5 grid gap-3 text-base leading-7 text-dark/[0.76]">
                    {hoursDisplay.map((line) => (
                      <p key={line.label}>
                        <span className="font-semibold text-dark">{line.label}:</span> {line.value}
                      </p>
                    ))}
                    {hoursNote && <p className="text-dark/60">{hoursNote}</p>}
                  </div>
                  <p className="mt-5 text-base leading-7 text-dark/70">
                    Positioned in the heart of downtown Evansville, the shop is built for
                    quick pickup runs, casual walk-ins, and groups that want dessert to be
                    the place they end the night.
                  </p>
                </div>

                {/* Google Map Embed */}
                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-dark/[0.08] shadow-[0_14px_26px_rgba(16,36,63,0.08)]">
                  <iframe
                    title="Cobblestone Creamery location map"
                    src="https://maps.google.com/maps?q=900+Main+Street+Evansville+Indiana+47708&t=m&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="220"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block w-full border-0"
                  />
                </div>

                {/* Social links */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61588303764359"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-dark/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/30 hover:bg-light-cream"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                    Follow on Facebook
                  </a>
                  <a
                    href="https://www.google.com/maps/place/Cobblestone+Creamery/@37.9716,-87.5711,15z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-dark/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/30 hover:bg-light-cream"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Business
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviewsWidget />

        <section className="bg-cream">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Frequently Asked Questions</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                The Quick Answers
              </h2>
            </div>

            <div className="mt-12 grid gap-5">
              {resolvedFaqItems.map((item) => (
                <article
                  key={item.question}
                  className="rounded-[1.75rem] border border-dark/[0.08] bg-white px-6 py-6 shadow-[0_14px_26px_rgba(16,36,63,0.06)]"
                >
                  <h3 className="font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                    {item.question}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-dark/[0.74]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
            <p className="text-sm uppercase tracking-[0.32em] text-gold">Ready To Order?</p>
            <h2 className="mt-4 font-serif text-5xl uppercase tracking-[0.08em] text-chalk md:text-6xl">
              Skip the Line.
              <span className="block text-gold">Keep the Dessert.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/[0.72]">
              Skip the wait and order ahead for pickup at Cobblestone Creamery. Your
              favorite scoops, shakes, and sundaes ready when you walk through the door
              at 900 Main Street in downtown Evansville, Indiana.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-flex items-center justify-center rounded-full bg-dugout-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#ca4438]"
              >
                Order Ice Cream Online
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-gold/60 hover:text-gold"
              >
                Browse The Menu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
