import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ORDER_ONLINE_URL } from '@/lib/links';

export const metadata: Metadata = {
  title: 'SMS Opt-In Consent | Cobblestone Creamery',
  description:
    'Review Cobblestone Creamery\'s SMS opt-in consent details for order updates, promotions, and store announcements in Evansville, Indiana.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/sms-optin',
  },
  openGraph: {
    title: 'SMS Opt-In Consent | Cobblestone Creamery',
    description:
      'Review Cobblestone Creamery\'s SMS opt-in consent details for order updates, promotions, and store announcements in Evansville, Indiana.',
    url: 'https://cobblestonecreamery.com/sms-optin',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery SMS opt-in consent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMS Opt-In Consent | Cobblestone Creamery',
    description:
      'Review Cobblestone Creamery\'s SMS opt-in consent details for order updates, promotions, and store announcements in Evansville, Indiana.',
    images: ['/logo.png'],
  },
};

export default function SmsOptInPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">SMS Opt-In Consent</h1>
            <p className="text-dark/60">Cobblestone Creamery SMS Messaging Program</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 space-y-10 text-dark/70 leading-relaxed">

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">How Users Opt In</h2>
              <p className="mb-6">
                During account creation on our online ordering platform at{' '}
                <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">
                  order.cobblestonecreamery.com
                </a>, customers are presented with an optional SMS consent checkbox. The checkbox is unchecked by
                default and must be actively selected by the user. Consent is not required to make a purchase.
              </p>

              {/* DO NOT DELETE: This image is required for SMS compliance and must remain accessible at /assets/cobblestone-sms-optin.png */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <img
                  src="/assets/cobblestone-sms-optin.png"
                  alt="Screenshot of Cobblestone Creamery account creation form showing SMS opt-in checkbox"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Consent Language</h2>
              <div className="bg-cream rounded px-6 py-5">
                <p className="text-dark font-medium mb-2">Exact opt-in text shown to users:</p>
                <p className="italic">
                  &ldquo;I agree to receive recurring SMS messages from Cobblestone Creamery
                  regarding promotions, loyalty rewards, order updates, and store
                  announcements. Consent is not a condition of purchase. Message and data
                  rates may apply. Reply STOP to unsubscribe or HELP for help.&rdquo;
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Program Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark">Program Name:</span> Cobblestone Creamery Alerts</p>
                <p><span className="font-medium text-dark">Message Types:</span> Order confirmations, promotional offers, loyalty rewards notifications, store announcements</p>
                <p><span className="font-medium text-dark">Message Frequency:</span> Up to 8 messages per month</p>
                <p><span className="font-medium text-dark">Opt-Out:</span> Reply STOP to any message to unsubscribe</p>
                <p><span className="font-medium text-dark">Help:</span> Reply HELP to any message for assistance</p>
                <p><span className="font-medium text-dark">Message &amp; Data Rates:</span> Standard message and data rates may apply</p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Contact Information</h2>
              <div className="bg-cream rounded px-6 py-5">
                <p className="font-medium text-dark">Cobblestone Creamery</p>
                <p>900 Main Street, Evansville, Indiana 47708</p>
                <p>
                  <a href="mailto:info@cobblestonecreamery.com" className="text-primary hover:text-gold transition-colors">
                    info@cobblestonecreamery.com
                  </a>
                </p>
                <p>
                  <a href="tel:8122053322" className="text-primary hover:text-gold transition-colors">
                    (812) 205-3322
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Related Policies</h2>
              <div className="flex gap-4">
                <a href="/privacy" className="text-primary hover:text-gold transition-colors font-medium">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-primary hover:text-gold transition-colors font-medium">
                  Terms &amp; Conditions
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
