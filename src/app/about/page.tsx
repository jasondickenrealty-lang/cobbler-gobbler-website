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
              Established in 2026 by two friends with a love of ice cream, cows, and community.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="font-serif text-2xl text-primary mb-6">How It All Began</h2>
            <p className="text-dark/70 leading-relaxed mb-6">
              Cobblestone Creamery started in 2026 when two longtime friends decided to turn
              their shared dream into something real: a neighborhood ice cream shop built on joy,
              quality, and a little small-town charm.
            </p>
            <p className="text-dark/70 leading-relaxed">
              Inspired by weekend farm drives, old-fashioned scoop shops, and a serious obsession
              with creamy flavors, they created a place where everyone feels welcome. Around here,
              we don&apos;t rush good ice cream: we like to moo-ve at the pace of great flavor.
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
                  Small-batch ice cream made with thoughtful ingredients,
                  bold flavors, and plenty of creativity.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  A welcoming shop where friends, families, and first-timers can gather,
                  laugh, and leave happier than they arrived.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-gold font-serif text-lg mt-0.5">&#8212;</span>
                <p className="text-dark/70 leading-relaxed">
                  A commitment to community partnerships and local spirit because,
                  honestly, that&apos;s where the herd heart is.
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
