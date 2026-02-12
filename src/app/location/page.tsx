import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LocationPage() {
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
                <p className="font-semibold">Cobbler Gobbler Ice Cream Shop</p>
                <p>123 Main Street</p>
                <p>Sweetville, ST 12345</p>
                <p className="mt-4">
                  <a href="tel:555-123-4567" className="text-primary hover:underline">
                    📞 (555) 123-4567
                  </a>
                </p>
                <p>
                  <a href="mailto:info@cobblergobbler.com" className="text-primary hover:underline">
                    ✉️ info@cobblergobbler.com
                  </a>
                </p>
              </address>
            </div>

            {/* Hours */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-accent">🕒 Hours</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Thursday</span>
                  <span>11am - 9pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Friday - Saturday</span>
                  <span>11am - 10pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>12pm - 8pm</span>
                </div>
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
