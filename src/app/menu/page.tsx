'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ORDER_ONLINE_URL } from '@/lib/links';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
  displayOrder?: number;
  categoryOrder?: number;
}

interface ModifierCategory {
  id: string;
  name: string;
  displayOrder?: number;
}

interface Modifier {
  id: string;
  name: string;
  price: number;
  modifierCategoryId: string;
  isActive?: boolean;
}

const FEATURED_CONES = [
  { id: 'superman', name: 'Superman', image: '/menu-cones/superman.png' },
  { id: 'butter-pecan', name: 'Butter Pecan', image: '/menu-cones/butter-pecan.jpeg' },
  { id: 'chocolate', name: 'Chocolate', image: '/menu-cones/chocolate.jpeg' },
  { id: 'chocolate-chip-cookie-dough', name: 'Chocolate Chip Cookie Dough', image: '/menu-cones/chocolate-chip-cookie-dough.jpeg' },
  { id: 'vanilla', name: 'Vanilla', image: '/menu-cones/vanilla.jpg' },
  { id: 'strawberry', name: 'Strawberry', image: '/menu-cones/strawberry.jpg' },
  { id: 'oreo', name: 'Oreo', image: '/menu-cones/oreo.jpg' },
  { id: 'mint-choc-chip', name: 'Mint Chocolate Chip', image: '/menu-cones/mint_chocolate_chip.jpeg' },
];
const FULL_MENU_PDF_URL = '/menu/cobblestone-full-menu.pdf';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [modifierCategories, setModifierCategories] = useState<ModifierCategory[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(
          collection(db, 'menu'),
          where('available', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];

        // Sort items by displayOrder (if set), then by name as fallback
        items.sort((a, b) => {
          // First sort by category order
          const catOrderA = a.categoryOrder ?? 999;
          const catOrderB = b.categoryOrder ?? 999;
          if (catOrderA !== catOrderB) return catOrderA - catOrderB;

          // Then by category name as tiebreaker
          const catCompare = a.category.localeCompare(b.category);
          if (catCompare !== 0) return catCompare;

          // Then by item displayOrder within category
          const orderA = a.displayOrder ?? 999;
          const orderB = b.displayOrder ?? 999;
          if (orderA !== orderB) return orderA - orderB;

          // Finally by name
          return a.name.localeCompare(b.name);
        });

        setMenuItems(items);

        // Build ordered unique categories preserving the sort order
        const uniqueCategories: string[] = [];
        for (const item of items) {
          if (!uniqueCategories.includes(item.category)) {
            uniqueCategories.push(item.category);
          }
        }
        setCategories(uniqueCategories);

        // Fetch modifier categories (toppings, flavors, etc.)
        const mcSnapshot = await getDocs(collection(db, 'modifierCategories'));
        const mcData = mcSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ModifierCategory[];
        mcData.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setModifierCategories(mcData);

        // Fetch modifiers
        const modSnapshot = await getDocs(query(collection(db, 'modifiers'), where('isActive', '!=', false)));
        const modData = modSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Modifier[];
        setModifiers(modData);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  const getCategoryAnchorId = (category: string) => {
    const slug = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `category-${slug}`;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Flavors of the Moo-nth</h1>
            <p className="text-dark/60 text-lg mb-8">
              Everything is made fresh daily with premium ingredients.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
              >
                Order for Pickup
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

        {/* Featured Cones */}
        <section className="bg-cream/30 border-y border-gold/20">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Featured Cones</h2>
              <div className="w-12 h-0.5 bg-gold mt-3 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 place-items-center">
              {FEATURED_CONES.map((cone) => (
                <figure key={cone.id} className="text-center">
                  <Image
                    src={cone.image}
                    alt={`${cone.name} cone`}
                    width={231}
                    height={432}
                    className="w-[180px] h-[260px] object-contain mx-auto drop-shadow-sm"
                  />
                  <figcaption className="mt-3 text-sm text-dark/70">{cone.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-dark/40">Loading menu...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dark/40">Menu items coming soon!</p>
              </div>
            ) : (
              <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-12">
                <aside className="hidden lg:block">
                  <div className="sticky top-24 rounded-xl border border-gold/20 bg-cream/40 p-5">
                    <h2 className="font-serif text-xl text-primary">Categories</h2>
                    <div className="w-10 h-0.5 bg-gold mt-2 mb-4"></div>
                    <nav className="space-y-2">
                      {categories.map((category) => (
                        <a
                          key={category}
                          href={`#${getCategoryAnchorId(category)}`}
                          className="block text-sm uppercase tracking-wide text-dark/70 hover:text-primary transition-colors"
                        >
                          {category}
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
                          key={category}
                          href={`#${getCategoryAnchorId(category)}`}
                          className="inline-block rounded-full border border-gold/30 px-3 py-1.5 text-xs uppercase tracking-wide text-dark/70 hover:text-primary hover:border-gold transition-colors"
                        >
                          {category}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-16">
                    {categories.map((category) => (
                      <div key={category} id={getCategoryAnchorId(category)} className="scroll-mt-24">
                        <div className="mb-8">
                          <h2 className="font-serif text-2xl md:text-3xl text-primary capitalize">{category}</h2>
                          <div className="w-12 h-0.5 bg-gold mt-3"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                          {getItemsByCategory(category).map((item) => (
                            <div key={item.id} className="group">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-48 object-cover rounded mb-4"
                                />
                              )}
                              <div className="flex justify-between items-baseline gap-4">
                                <h3 className="font-medium text-dark">{item.name}</h3>
                                <span className="text-gold font-serif text-lg flex-shrink-0">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-dark/50 text-sm mt-1 leading-relaxed">{item.description}</p>
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
                  <h2 className="font-serif text-3xl md:text-4xl text-primary">Current Toppings & Flavors</h2>
                  <div className="w-12 h-0.5 bg-gold mt-3 mx-auto"></div>
                  <p className="text-dark/50 mt-4">Our selection rotates monthly — here&apos;s what&apos;s available now!</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {modifierCategories.map((mc) => {
                    const categoryMods = modifiers.filter(m => m.modifierCategoryId === mc.id);
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
                                <span className="text-gold text-xs font-medium">+${mod.price.toFixed(2)}</span>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
