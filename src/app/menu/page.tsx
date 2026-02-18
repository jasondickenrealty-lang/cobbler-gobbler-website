'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(
          collection(db, 'menu'),
          where('available', '==', true),
          orderBy('category'),
          orderBy('name')
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];

        setMenuItems(items);
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
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

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Menu</h1>
            <p className="text-dark/60 text-lg mb-8">
              Everything is made fresh daily with premium ingredients.
            </p>
            <a
              href="/order"
              className="inline-block bg-gold text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
            >
              Order for Pickup
            </a>
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-dark/40">Loading menu...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dark/40">Menu items coming soon!</p>
              </div>
            ) : (
              <div className="space-y-16">
                {categories.map((category) => (
                  <div key={category}>
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
