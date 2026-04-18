import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { FREE_GAME_PLAY_URL, ORDER_ONLINE_URL } from '@/lib/links';

const faqItems = [
  {
    question: 'Where is Cobblestone Creamery located?',
    answer:
      'Cobblestone Creamery is located at 900 Main Street in downtown Evansville, Indiana 47708.',
  },
  {
    question: 'What desserts do you serve?',
    answer:
      'We serve handcrafted ice cream, fresh waffle cones, milkshakes, sundaes, bowls, cobblers, and rotating specials made for pickup and walk-in guests.',
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
      'We are open Monday through Thursday from 11:00 AM to 9:00 PM, Friday and Saturday from 11:00 AM to 10:00 PM, and Sunday from 12:00 PM to 8:00 PM.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const quickHits = [
  { label: 'Fresh Daily', value: 'Waffle Cones' },
  { label: 'Downtown Pickup', value: 'Fast Ordering' },
  { label: 'Family Favorite', value: 'Kids Scoop Offers' },
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

const fanFavorites = [
  {
    title: 'Triple Peanut Butter Cup',
    blurb: 'Rich, stacked, and built like a cleanup hitter.',
    image: '/menu-cones/triple-peanut-butter-cup.png',
    alt: 'Triple Peanut Butter Cup ice cream',
  },
  {
    title: 'Superman',
    blurb: 'Bright color, nostalgic flavor, and instant kid approval.',
    image: '/menu-cones/superman.png',
    alt: 'Superman ice cream flavor',
  },
  {
    title: 'Strawberry',
    blurb: 'Classic scoop-shop sweetness with a little summer feel.',
    image: '/menu-cones/strawberry.jpg',
    alt: 'Strawberry ice cream',
  },
  {
    title: 'Mint Chocolate Chip',
    blurb: 'Cool, crisp, and one of the first tubs to disappear.',
    image: '/menu-cones/mint_chocolate_chip.jpeg',
    alt: 'Mint chocolate chip ice cream',
  },
];

const clubhouseNotes = [
  'Built in downtown Evansville for families, date nights, and after-dinner dessert runs.',
  'Easy online ordering for pickup when you want the line skipped and the treats ready.',
  'Fundraisers, giveaways, and rotating menu moments that keep the shop feeling active.',
];

const visitStats = [
  { label: 'Address', value: '900 Main Street' },
  { label: 'Call Ahead', value: '(812) 205-3322' },
  { label: 'Order Pickup', value: 'Fast Checkout' },
  { label: 'Open Late', value: 'Fri + Sat' },
];

export default function HomePage() {
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

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-24 md:pt-24">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="mb-5 inline-flex items-center gap-3 rounded-full border border-gold/50 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.34em] text-gold">
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

                <h1 className="font-serif text-6xl uppercase leading-[0.9] tracking-[0.08em] text-chalk sm:text-7xl md:text-8xl">
                  Cobblestone
                  <span className="block text-gold">Creamery</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78] md:text-xl">
                  Where downtown Evansville comes for fresh waffle cones, stacked
                  milkshakes, loaded sundaes, and dessert-shop energy that feels a
                  little more like game night than a quiet line at the freezer case.
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

                <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
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

              <div className="rounded-[2rem] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.34em] text-gold">Tonight&apos;s Lineup</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-dark/[0.35] p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/60">Best For</p>
                    <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                      Fresh Scoops
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                      House-made waffle cones, rotating flavors, and quick pickup ordering.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-dark/[0.35] p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/60">Fan Club</p>
                    <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                      Kids Scoop
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                      Keep the family rotation moving with specials built for younger guests.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-dark/[0.35] p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/60">Community</p>
                    <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                      Fundraisers
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                      Sports teams, schools, and local groups can team up with us for events.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-dark/[0.35] p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/60">Bonus Play</p>
                    <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                      Monthly Game
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                      Orders can unlock game play, surprise wins, and reasons to come back again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-dark/10 bg-cream">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">From The Counter</p>
              <h2 className="mt-2 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                Bigger Flavor.
                <span className="block text-dugout-red">Stronger Personality.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-dark/[0.72]">
                The Casey&apos;s reference works because every section feels intentional and
                alive. This redesign follows that same idea for Cobblestone: bold hero,
                stronger sections, easier calls to action, and a more memorable visual rhythm.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/free-kids-scoop"
                className="rounded-[1.75rem] border border-primary/[0.12] bg-white px-6 py-6 shadow-[0_16px_30px_rgba(16,36,63,0.08)] transition-transform duration-200 hover:translate-y-[-2px]"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-dugout-red">Promo</p>
                <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                  Free Kids Scoop
                </p>
                <p className="mt-3 text-sm leading-6 text-dark/70">
                  Make the family offer easy to spot right from the homepage.
                </p>
              </Link>
              <a
                href={FREE_GAME_PLAY_URL}
                className="rounded-[1.75rem] border border-primary/[0.12] bg-primary px-6 py-6 text-white shadow-[0_16px_30px_rgba(16,36,63,0.16)] transition-transform duration-200 hover:translate-y-[-2px]"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Rewards</p>
                <p className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                  Game Play
                </p>
                <p className="mt-3 text-sm leading-6 text-white/[0.72]">
                  Push traffic into the monthly game without burying it in the nav.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-light-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">What To Order</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                The Dessert Counter
                <span className="block text-ballpark-blue">Feels Like The Main Event</span>
              </h2>
              <p className="mt-4 text-lg leading-8 text-dark/[0.72]">
                The reference site leans on appetite and atmosphere. This section does the
                same for Cobblestone by putting your signature categories right up front.
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
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Why It Works</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                Built For The
                <span className="block text-ballpark-blue">Regular Rotation</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-dark/[0.72]">
                The Casey&apos;s site leans into identity. For Cobblestone, that identity is
                simple: a downtown dessert shop with personality, easy ordering, and enough
                motion in the layout that the homepage feels active before anybody even taps
                the menu.
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
                <p className="text-sm uppercase tracking-[0.32em] text-gold">Promos + Community</p>
                <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-chalk md:text-5xl">
                  Keep The Homepage
                  <span className="block text-gold">Working Harder</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/[0.76]">
                  The reference site uses bold promotional moments to break up the page.
                  For Cobblestone, the strongest versions of that are the free kids scoop,
                  online ordering, and fundraising callouts.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.8rem] border border-white/[0.14] bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Feature One</p>
                  <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                    Free Kids Scoop
                  </h3>
                  <p className="mt-3 text-base leading-7 text-white/[0.72]">
                    A clear family-focused promotion that deserves bigger placement.
                  </p>
                  <Link
                    href="/free-kids-scoop"
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    View Promotion
                  </Link>
                </div>
                <div className="rounded-[1.8rem] border border-white/[0.14] bg-dark/[0.28] p-6 backdrop-blur-sm">
                  <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">Feature Two</p>
                  <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] text-chalk">
                    Community Nights
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

        <section className="bg-light-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Fan Favorites</p>
                <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                  Flavor Cards
                  <span className="block text-ballpark-blue">That Sell The Shop</span>
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
                  key={item.title}
                  className="overflow-hidden rounded-[2rem] border border-dark/[0.08] bg-white shadow-[0_16px_30px_rgba(16,36,63,0.08)]"
                >
                  <div className="relative h-64">
                    <Image src={item.image} alt={item.alt} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-3xl uppercase tracking-[0.08em] text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-dark/[0.72]">{item.blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
                    <a href="tel:+18122053322" className="transition-colors hover:text-gold">
                      (812) 205-3322
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
                    <p>
                      <span className="font-semibold text-dark">Monday - Thursday:</span> 11:00 AM - 9:00 PM
                    </p>
                    <p>
                      <span className="font-semibold text-dark">Friday - Saturday:</span> 11:00 AM - 10:00 PM
                    </p>
                    <p>
                      <span className="font-semibold text-dark">Sunday:</span> 12:00 PM - 8:00 PM
                    </p>
                  </div>
                  <p className="mt-5 text-base leading-7 text-dark/70">
                    Positioned in the heart of downtown Evansville, the shop is built for
                    quick pickup runs, casual walk-ins, and groups that want dessert to be
                    the place they end the night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-dugout-red">Frequently Asked Questions</p>
              <h2 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] text-primary md:text-5xl">
                The Quick Answers
              </h2>
            </div>

            <div className="mt-12 grid gap-5">
              {faqItems.map((item) => (
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
              Skip The Line.
              <span className="block text-gold">Keep The Dessert.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/[0.72]">
              Order ahead for pickup from Cobblestone Creamery and let the homepage do what
              it should do: create appetite, explain the vibe, and move people toward checkout.
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
