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
                Cobblestone Creamery collects SMS consent through three channels, all of them web forms. In
                every case the consent checkbox is unchecked by default and must be actively selected by the
                customer. Consent is never required to make a purchase, to create an account, or to join our
                loyalty program. We do not collect SMS consent on paper, over the phone, or by any means
                other than the forms described below.
              </p>

              <h3 className="font-medium text-dark mb-2">1. Online ordering account creation</h3>
              <p className="mb-6">
                When creating an account on our online ordering platform at{' '}
                <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">
                  order.cobblestonecreamery.com
                </a>, customers are presented with an optional SMS consent checkbox alongside the sign-up form.
                A link to this Privacy Policy is shown directly beneath the checkbox.
              </p>

              {/* DO NOT DELETE: This image is required for SMS compliance and must remain accessible at /assets/cobblestone-sms-optin.png */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
                <img
                  src="/assets/cobblestone-sms-optin.png"
                  alt="Screenshot of Cobblestone Creamery account creation form showing SMS opt-in checkbox"
                  className="w-full h-auto"
                />
              </div>

              <h3 className="font-medium text-dark mb-2">2. Online loyalty program sign-up</h3>
              <p className="mb-6">
                Customers who join our loyalty rewards program from our website do so at{' '}
                <a href="/loyalty-signup" className="text-primary hover:text-gold transition-colors font-medium">
                  cobblestonecreamery.com/loyalty-signup
                </a>. The form carries the same optional, unchecked SMS consent checkbox, and states that
                membership does not require opting in to text messages.
              </p>

              <h3 className="font-medium text-dark mb-2">3. In-store loyalty sign-up kiosk</h3>
              <p className="mb-6">
                Customers who join the loyalty program in person at 900 Main Street, Evansville, Indiana do so
                on a self-service kiosk screen at the counter. The kiosk displays the web form hosted at{' '}
                <a href="/loyalty-kiosk" className="text-primary hover:text-gold transition-colors font-medium">
                  cobblestonecreamery.com/loyalty-kiosk
                </a>, which reviewers may view directly. After entering their name, phone number, and email,
                the customer is shown an optional SMS consent checkbox that is unchecked by default. Staff do
                not select the checkbox on a customer&apos;s behalf, and declining it does not affect loyalty
                enrollment. No paper sign-up forms are used.
              </p>

              <p>
                Customers who opt in through any of these channels can later turn SMS messages on or off at
                any time from the account settings page on our online ordering platform, in addition to
                replying <strong>STOP</strong> to any message.
              </p>
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
                  <a href="tel:8124999866" className="text-primary hover:text-gold transition-colors">
                    (812) 499-9866
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
