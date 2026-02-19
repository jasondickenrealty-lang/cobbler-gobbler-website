'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';

interface ColoringPage {
  id: string;
  title: string;
  downloadUrl: string;
  active?: boolean;
}

export default function FreeKidsScoopPage() {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const q = query(collection(db, 'coloringPages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const uploadedPages = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as ColoringPage)
          .filter((page) => page.active !== false && !!page.downloadUrl);
        setPages(uploadedPages);
      } catch (error) {
        console.error('Error loading coloring pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">FREE KIDS SCOOP</h1>
            <p className="text-dark/70 text-lg leading-relaxed">
              Download a coloring page, color it at home, and bring it in to Cobblestone Creamery
              for a free kids scoop.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            {loading ? (
              <div className="text-center py-10 text-dark/50">Loading coloring pages...</div>
            ) : pages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-dark/60 text-lg mb-3">Coloring pages are coming soon.</p>
                <p className="text-dark/50 text-sm">
                  Staff can upload them in the Employee Portal under Coloring Pages.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <div key={page.id} className="border border-dark/10 rounded p-6 flex flex-col">
                    <h2 className="font-serif text-xl text-primary mb-3">{page.title}</h2>
                    <p className="text-dark/60 text-sm mb-6 flex-1">
                      Printable coloring page to download, color, and bring in.
                    </p>
                    <a
                      href={page.downloadUrl}
                      download
                      className="inline-block text-center bg-gold text-white px-5 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
                    >
                      Download
                    </a>
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
