'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ORDER_ONLINE_URL } from '@/lib/links';

interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours?: {
    [key: string]: string;
  };
}

const VISIT_US_EMAIL = 'hello@cobblestonecremery.com';

const FALLBACK: BusinessInfo = {
  name: 'Cobblestone Creamery',
  address: '900 Main Street',
  city: 'Evansville',
  state: 'Indiana',
  zip: '47708',
  phone: '(812) 205-3322',
  email: VISIT_US_EMAIL,
  hours: {
    'Monday - Thursday': '11am - 9pm',
    'Friday - Saturday': '11am - 10pm',
    'Sunday': '12pm - 8pm',
  },
};

export default function LocationPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(FALLBACK);

  useEffect(() => {
    let isMounted = true;

    const fetchBusinessInfo = async () => {
      try {
        const hasFirebaseConfig =
          !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (!hasFirebaseConfig) {
          return;
        }

        const [{ doc, getDoc }, { db }] = await Promise.all([
          import('firebase/firestore'),
          import('@/lib/firebase'),
        ]);

        const docRef = doc(db, 'settings', 'business');
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<BusinessInfo>;
          setBusinessInfo((prev) => ({ ...prev, ...data }));
        }
      } catch {}
    };

    fetchBusinessInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapQuery = encodeURIComponent(
    `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zip}`
  );
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const googleMapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Visit Our Ice Cream Shop in Downtown Evansville</h1>
            <p className="text-dark/60 text-lg">
              Cobblestone Creamery is located at 900 Main Street in the heart of downtown Evansville, Indiana.
              Stop by for handcrafted ice cream, fresh waffle cones, signature milkshakes, sundaes, and classic
              cobblers — or{' '}
              <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold underline transition-colors">
                order online for pickup
              </a>.
            </p>
          </div>
        </section>

        {/* Info */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Location */}
              <div>
                <h2 className="font-serif text-2xl text-primary mb-2">Location</h2>
                <div className="w-10 h-0.5 bg-gold mb-6"></div>
                <address className="not-italic text-dark/70 space-y-3">
                  <p className="font-medium text-dark">{businessInfo.name}</p>
                  <p>{businessInfo.address}</p>
                  <p>{businessInfo.city}, {businessInfo.state} {businessInfo.zip}</p>
                  <div className="pt-4 space-y-2">
                    <p>
                      <a href={`tel:${businessInfo.phone.replace(/\D/g, '')}`} className="text-primary hover:text-gold transition-colors">
                        {businessInfo.phone}
                      </a>
                    </p>
                    <p>
                      <a href={`mailto:${businessInfo.email || VISIT_US_EMAIL}`} className="text-primary hover:text-gold transition-colors">
                        {businessInfo.email || VISIT_US_EMAIL}
                      </a>
                    </p>
                  </div>
                </address>
              </div>

              {/* Hours */}
              <div>
                <h2 className="font-serif text-2xl text-primary mb-2">Hours</h2>
                <div className="w-10 h-0.5 bg-gold mb-6"></div>
                <div className="space-y-3">
                  {businessInfo.hours && Object.entries(businessInfo.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-dark/70">
                      <span className="font-medium text-dark">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-cream rounded px-5 py-4 text-center">
                  <p className="text-primary font-serif">Open 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="bg-white rounded border border-dark/5 overflow-hidden">
              <iframe
                title="Cobblestone Creamery location map - 900 Main Street Evansville Indiana"
                src={googleMapsEmbedUrl}
                className="w-full h-72 md:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={googleMapsOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium tracking-wide uppercase text-primary border-b-2 border-gold pb-1 hover:text-gold transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="font-serif text-2xl text-primary mb-6">Explore Cobblestone Creamery</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                View Our Menu
              </Link>
              <Link
                href="/about"
                className="inline-block border border-primary text-primary px-6 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-white transition-colors"
              >
                Read Our Story
              </Link>
              <a
                href={ORDER_ONLINE_URL}
                className="inline-block bg-gold text-white px-6 py-2.5 rounded text-sm font-medium tracking-wide uppercase hover:bg-gold/90 transition-colors"
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
