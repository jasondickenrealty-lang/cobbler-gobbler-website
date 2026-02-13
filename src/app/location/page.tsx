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

export default function LocationPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const docRef = doc(db, 'settings', 'business');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBusinessInfo(docSnap.data() as BusinessInfo);
        } else {
          // Fallback data if not set in Firestore
          setBusinessInfo({
            name: 'Cobbler Gobbler Ice Cream Shop',
            address: '123 Main Street',
            city: 'Sweetville',
            state: 'ST',
            zip: '12345',
            phone: '(555) 123-4567',
            email: 'info@cobblergobbler.com',
            hours: {
              'Monday - Thursday': '11am - 9pm',
              'Friday - Saturday': '11am - 10pm',
              'Sunday': '12pm - 8pm',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
        // Use fallback data
        setBusinessInfo({
          name: 'Cobbler Gobbler Ice Cream Shop',
          address: '123 Main Street',
          city: 'Sweetville',
          state: 'ST',
          zip: '12345',
          phone: '(555) 123-4567',
          email: 'info@cobblergobbler.com',
          hours: {
            'Monday - Thursday': '11am - 9pm',
            'Friday - Saturday': '11am - 10pm',
            'Sunday': '12pm - 8pm',
          },
        });
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
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary">Visit Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Location */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-accent">📍 Location</h2>
              <address className="not-italic text-gray-700 space-y-2">
                <p className="font-semibold">{businessInfo?.name}</p>
                <p>{businessInfo?.address}</p>
                <p>{businessInfo?.city}, {businessInfo?.state} {businessInfo?.zip}</p>
                <p className="mt-4">
                  <a href={`tel:${businessInfo?.phone}`} className="text-primary hover:underline">
                    📞 {businessInfo?.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${businessInfo?.email}`} className="text-primary hover:underline">
                    ✉️ {businessInfo?.email}
                  </a>
                </p>
              </address>
            </div>

            {/* Hours */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-accent">🕒 Hours</h2>
              <div className="space-y-3 text-gray-700">
                {businessInfo?.hours && Object.entries(businessInfo.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-secondary rounded text-center">
                  <p className="font-semibold">Open Daily!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Get Directions</h2>
            <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
              <p className="text-gray-500">Map integration placeholder</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
