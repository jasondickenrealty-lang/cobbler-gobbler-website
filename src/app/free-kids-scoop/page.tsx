'use client';

import { useEffect, useState } from 'react';
import { doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';

interface ColoringPage {
  id: string;
  title: string;
  downloadUrl: string;
  downloadCount?: number;
}

const ALLOWED_DOWNLOAD_HOSTS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'firebasestorage.app',
];

function isValidDownloadUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (ALLOWED_DOWNLOAD_HOSTS.includes(parsed.hostname)) return true;
    return parsed.hostname.endsWith('.firebasestorage.app');
  } catch {
    return false;
  }
}

async function downloadFile(url: string, title: string) {
  if (!isValidDownloadUrl(url)) {
    alert('Invalid download URL. Please contact support.');
    return;
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = blob.type.split('/').pop() || 'png';
    const filename = `${title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}

async function trackDownload(pageId: string) {
  try {
    await updateDoc(doc(db, 'coloringPages', pageId), {
      downloadCount: increment(1),
      lastDownloadedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Failed to track coloring page download:', error);
  }
}

export default function FreeKidsScoopPage() {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [loading, setLoading] = useState(true);
  const visiblePages = pages.filter((page) => isValidDownloadUrl(page.downloadUrl));

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/free-kids-scoop');
        if (!res.ok) throw new Error(`Failed to load coloring pages`);
        const data = await res.json();
        setPages(data.pages || []);
      } catch (error) {
        console.error('Error loading coloring pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleDownload = (page: ColoringPage) => {
    void trackDownload(page.id);
    void downloadFile(page.downloadUrl, page.title);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Free Kids Ice Cream Scoop</h1>
            <p className="text-dark/70 text-lg leading-relaxed">
              Download a coloring page, color it at home, and bring it into Cobblestone Creamery
              at 900 Main Street in downtown Evansville, Indiana for a free kids scoop of ice cream.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            {loading ? (
              <div className="text-center py-10 text-dark/50">Loading coloring pages...</div>
            ) : visiblePages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-dark/60 text-lg mb-3">Coloring pages are coming soon.</p>
                <p className="text-dark/50 text-sm">
                  Staff can upload them in the Employee Portal under Coloring Pages.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {visiblePages.map((page) => (
                  <div key={page.id} className="border border-dark/10 rounded overflow-hidden flex flex-col">
                    <div className="aspect-[3/4] bg-cream/50 overflow-hidden">
                      <img
                        src={page.downloadUrl}
                        alt={`${page.title} - free coloring page from Cobblestone Creamery`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="font-serif text-xl text-primary mb-3">{page.title}</h2>
                      <p className="text-dark/60 text-sm mb-5 flex-1">
                        Download, color, and bring it in for a free kids scoop!
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDownload(page)}
                        className="text-center bg-gold text-white inline-flex min-h-[44px] items-center justify-center px-5 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors cursor-pointer"
                      >
                        Download
                      </button>
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
