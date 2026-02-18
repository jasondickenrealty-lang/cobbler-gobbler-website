import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Story</h1>
            <p className="text-dark/60 text-lg">
              A family tradition of handcrafted goodness since 2010.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">How It All Began</h2>
            <p className="text-dark/70 leading-relaxed mb-6">
              Cobblestone Creamery has been serving the community since 2010.
              What started as a small family business has grown into a beloved local destination
              for homemade ice cream and traditional cobblers.
            </p>
            <p className="text-dark/70 leading-relaxed">
              We believe in using only the finest ingredients to create delicious treats that
              bring families together. Every scoop is made with love, and every cobbler is
              baked fresh daily using recipes passed down through generations.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-cream">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">What We Stand For</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  100% homemade ice cream crafted without artificial ingredients,
                  because real flavor comes from real food.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  Fresh cobblers baked every single day, using seasonal fruits
                  and time-tested family recipes.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  Supporting local farmers and suppliers, because our community
                  is at the heart of everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">Join Our Team</h2>
            <p className="text-dark/70 leading-relaxed">
              We&apos;re always looking for friendly, hardworking individuals to join our team.
              If you&apos;re passionate about great food and excellent customer service,
              we&apos;d love to hear from you. Stop by the shop or reach out to learn about
              current openings.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
