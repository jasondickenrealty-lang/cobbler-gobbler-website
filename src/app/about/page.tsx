import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">About Us</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                Cobbler Gobbler Ice Cream Shop has been serving the community since 2010.
                What started as a small family business has grown into a beloved local destination
                for homemade ice cream and traditional cobblers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                We believe in using only the finest ingredients to create delicious treats that
                bring families together. Every scoop is made with love, and every cobbler is
                baked fresh daily using recipes passed down through generations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">What Makes Us Special</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>100% homemade ice cream with no artificial ingredients</li>
                <li>Fresh cobblers baked daily</li>
                <li>Family-owned and operated</li>
                <li>Supporting local farmers and suppliers</li>
                <li>Committed to our community</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">Join Our Team</h2>
              <p className="text-gray-700 leading-relaxed">
                We&apos;re always looking for friendly, hardworking individuals to join our team.
                If you&apos;re passionate about great food and excellent customer service,
                we&apos;d love to hear from you!
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
