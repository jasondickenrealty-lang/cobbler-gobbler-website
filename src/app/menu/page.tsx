'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        
        // Get unique categories
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
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary">Our Menu</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading menu...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Menu items coming soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-3xl font-semibold mb-6 text-accent capitalize">{category}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {getItemsByCategory(category).map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
