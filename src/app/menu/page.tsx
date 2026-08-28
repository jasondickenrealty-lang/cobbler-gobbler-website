import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ORDER_ONLINE_URL } from '@/lib/links';
import FlavorCone from '@/components/FlavorCone';
import { getSiteContent, flavorAlt } from '@/lib/siteContent';
import { getMenuData, categoryAnchorId, type MenuItem, type MenuCategory } from '@/lib/menu-data';

// Server-render the menu and refresh from Firestore at most every 10 minutes.
// This puts the real menu in the HTML response so Google can read it directly.
export const runtime = 'nodejs';
export const revalidate = 600;

const FULL_MENU_PDF_URL = '/menu/cobblestone-full-menu.pdf';

const SITE_URL = 'https://cobblestonecreamery.com';

function buildMenuJsonLd(items: MenuItem[], categories: MenuCategory[]) {
  if (categories.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Cobblestone Creamery Menu',
    url: `${SITE_URL}/menu`,
    hasMenuSection: categories.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      ...(category.description ? { description: category.description } : {}),
      hasMenuItem: items
        .filter((item) => item.category === category.name)
        .map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
          ...(typeof item.price === 'number'
            ? {
                offers: {
                  '@type': 'Offer',
                  price: item.price.toFixed(2),
                  priceCurrency: 'USD',
                },
              }
            : {}),
        })),
    })),
  };
}

export default async function MenuPage() {
  const { ok, items, categories, modifierCategories, modifiers } = await getMenuData();
  const { featuredFlavors } = await getSiteContent();
  const hasMenu = ok && items.length > 0;
  const menuJsonLd = buildMenuJsonLd(items, categories);

  const getItemsByCategory = (category: string) =>
    items.filter((item) => item.category === category);

  return (
    <>
      {menuJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Ice Cream Menu — Cobblestone Creamery
            </h1>
            <p className="text-dark/60 text-lg mb-8">
              Explore the Cobblestone Creamery menu in downtown Evansville, featuring premium
              ice cream, fresh waffle cones, signature milkshakes, loaded sundaes, cobbler
              bowls, and quick lunch options. Order ahead for pickup at 900 Main Street.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order Ice Cream for Pickup
              </a>
              <a
                href={FULL_MENU_PDF_URL}
                download
                className="inline-block border border-primary text-primary px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-white transition-colors"
              >
                Download Full Menu (PDF)
              </a>
            </div>
          </div>
        </section>

        {/* Featured Cones — hidden entirely when the owner has cleared the lineup. */}
        {featuredFlavors.length > 0 && (
        <section className="bg-cream/30 border-y border-gold/20">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Featured Cones</h2>
              <div className="w-12 h-0.5 bg-gold mt-3 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 lg:grid-cols-5 place-items-center">
              {featuredFlavors.map((cone) => (
                <figure key={cone.name} className="text-center">
                  {cone.image ? (
                    <Image
                      src={cone.image}
                      alt={flavorAlt(cone)}
                      width={231}
                      height={432}
                      className="w-full max-w-[180px] h-auto object-contain mx-auto drop-shadow-sm"
                    />
                  ) : (
                    <FlavorCone
                      name={cone.name}
                      className="w-full max-w-[180px] h-auto mx-auto drop-shadow-sm"
                    />
                  )}
                  <figcaption className="mt-3 text-sm text-dark/70">{cone.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Menu Items */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            {!hasMenu ? (
              <div className="text-center py-12">
                <div className="max-w-2xl mx-auto">
                  <h2 className="font-serif text-2xl text-primary mb-4">Our Menu</h2>
                  <p className="text-dark/60 leading-relaxed mb-4">
                    At Cobblestone Creamery in downtown Evansville, Indiana, we serve premium
                    ice cream in fresh waffle cones, bowls, and loaded sundaes, plus signature
                    milkshakes, classic cobbler bowls, floats, and rotating monthly flavors.
                  </p>
                  <p className="text-dark/60 leading-relaxed">
                    For the full up-to-the-minute list with current prices, download our menu
                    PDF above or{' '}
                    <a href={ORDER_ONLINE_URL} className="text-gold underline hover:text-gold/80">
                      view everything on our online ordering page
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-12">
                <aside className="hidden lg:block">
                  <div className="sticky top-24 rounded-xl border border-gold/20 bg-cream/40 p-5">
                    <h2 className="font-serif text-xl text-primary">Categories</h2>
                    <div className="w-10 h-0.5 bg-gold mt-2 mb-4"></div>
                    <nav className="space-y-2" aria-label="Menu categories">
                      {categories.map((category) => (
                        <a
                          key={category.name}
                          href={`#${categoryAnchorId(category.name)}`}
                          className="block text-sm uppercase tracking-wide text-dark/70 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>

                <div>
                  <div className="lg:hidden mb-8">
                    <h2 className="font-serif text-xl text-primary mb-3">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <a
                          key={category.name}
                          href={`#${categoryAnchorId(category.name)}`}
                          className="inline-flex min-h-[44px] items-center rounded-full border border-gold/30 px-4 py-2.5 text-sm uppercase tracking-wide text-dark/70 hover:text-primary hover:border-gold transition-colors"
                        >
                          {category.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-16">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        id={categoryAnchorId(category.name)}
                        className="scroll-mt-24"
                      >
                        <div className="mb-8">
                          <h2 className="font-serif text-2xl md:text-3xl text-primary capitalize">
                            {category.name}
                          </h2>
                          <div className="w-12 h-0.5 bg-gold mt-3"></div>
                          {category.description && (
                            <p className="text-dark/60 mt-3 max-w-2xl leading-relaxed">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                          {getItemsByCategory(category.name).map((item) => (
                            <div key={item.id} className="group">
                              {item.imageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.imageUrl}
                                  alt={`${item.name} — ${item.category} at Cobblestone Creamery in Evansville`}
                                  className="w-full h-48 object-cover rounded mb-4"
                                  loading="lazy"
                                  width={400}
                                  height={192}
                                />
                              )}
                              <div className="flex justify-between items-baseline gap-4">
                                <h3 className="font-medium text-dark">{item.name}</h3>
                                {typeof item.price === 'number' && (
                                  <span className="text-gold font-serif text-lg flex-shrink-0">
                                    ${item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-dark/50 text-sm mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Toppings & Flavors Section */}
            {modifierCategories.length > 0 && (
              <div className="mt-20">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-3xl md:text-4xl text-primary">
                    Current Toppings &amp; Flavors
                  </h2>
                  <div className="w-12 h-0.5 bg-gold mt-3 mx-auto"></div>
                  <p className="text-dark/50 mt-4">
                    Our selection rotates monthly — here&apos;s what&apos;s available now.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {modifierCategories.map((mc) => {
                    const categoryMods = modifiers.filter((m) => m.modifierCategoryId === mc.id);
                    if (categoryMods.length === 0) return null;

                    return (
                      <div key={mc.id} className="bg-cream rounded-xl p-6">
                        <h3 className="font-serif text-xl text-primary mb-1">{mc.name}</h3>
                        <div className="w-8 h-0.5 bg-gold mb-4"></div>
                        <div className="flex flex-wrap gap-2">
                          {categoryMods.map((mod) => (
                            <span
                              key={mod.id}
                              className="inline-flex items-center gap-1.5 bg-white text-dark text-sm px-3 py-1.5 rounded-full border border-gold/30"
                            >
                              {mod.name}
                              {mod.price > 0 && (
                                <span className="text-gold text-xs font-medium">
                                  +${mod.price.toFixed(2)}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order CTA */}
            <div className="mt-20 rounded-2xl bg-primary px-6 py-12 text-center text-white">
              <h2 className="font-serif text-3xl md:text-4xl text-chalk">Order Ahead for Pickup</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/80">
                Skip the line and have your scoops, shakes, and sundaes ready when you arrive at
                900 Main Street in downtown Evansville.
              </p>
              <a
                href={ORDER_ONLINE_URL}
                className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-gold/90"
              >
                Order Ice Cream Online
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
