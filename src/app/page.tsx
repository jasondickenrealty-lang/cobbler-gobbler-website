import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Cobbler Gobbler</h1>
            <p className="text-xl mb-8">Homemade Ice Cream & Delicious Desserts</p>
            <Link
              href="/menu"
              className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              View Our Menu
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🍦</div>
                <h3 className="text-xl font-semibold mb-2">Fresh Daily</h3>
                <p className="text-gray-600">Made fresh every day with premium ingredients</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🥧</div>
                <h3 className="text-xl font-semibold mb-2">Classic Cobblers</h3>
                <p className="text-gray-600">Traditional recipes passed down for generations</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold mb-2">Family Owned</h3>
                <p className="text-gray-600">Locally owned and operated with love</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Visit Us Today!</h2>
            <p className="text-lg mb-6">Experience the taste of homemade goodness</p>
            <Link
              href="/location"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition inline-block"
            >
              Get Directions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
