'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const FALLBACK: BusinessInfo = {
  name: 'Cobblestone Creamery',
  address: '123 Main Street',
  city: 'Sweetville',
  state: 'ST',
  zip: '12345',
  phone: '(555) 123-4567',
  email: 'info@cobblestonecreamery.com',
  hours: {
    'Monday - Thursday': '11am - 9pm',
    'Friday - Saturday': '11am - 10pm',
    'Sunday': '12pm - 8pm',
  },
};

export default function LocationPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const docRef = doc(db, 'settings', 'business');
        const docSnap = await getDoc(docRef);
        setBusinessInfo(docSnap.exists() ? (docSnap.data() as BusinessInfo) : FALLBACK);
      } catch {
        setBusinessInfo(FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessInfo();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="text-dark/40">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Visit Us</h1>
            <p className="text-dark/60 text-lg">
              We&apos;d love to see you. Stop by for a scoop or place an order ahead.
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
                  <p className="font-medium text-dark">{businessInfo?.name}</p>
                  <p>{businessInfo?.address}</p>
                  <p>{businessInfo?.city}, {businessInfo?.state} {businessInfo?.zip}</p>
                  <div className="pt-4 space-y-2">
                    <p>
                      <a href={`tel:${businessInfo?.phone?.replace(/\D/g, '')}`} className="text-primary hover:text-gold transition-colors">
                        {businessInfo?.phone}
                      </a>
                    </p>
                    <p>
                      <a href={`mailto:${businessInfo?.email}`} className="text-primary hover:text-gold transition-colors">
                        {businessInfo?.email}
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
                  {businessInfo?.hours && Object.entries(businessInfo.hours).map(([day, hours]) => (
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

        {/* Map placeholder */}
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="bg-white rounded h-64 flex items-center justify-center border border-dark/5">
              <p className="text-dark/30 text-sm">Map coming soon</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
