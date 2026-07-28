import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Cobblestone Creamery',
  description:
    'Review Cobblestone Creamery\'s terms and conditions for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Cobblestone Creamery',
    description:
      'Review Cobblestone Creamery\'s terms and conditions for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
    url: 'https://cobblestonecreamery.com/terms',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery terms and conditions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | Cobblestone Creamery',
    description:
      'Review Cobblestone Creamery\'s terms and conditions for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
    images: ['/logo.png'],
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Terms &amp; Conditions</h1>
            <p className="text-dark/60">Last updated: February 18, 2026</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 space-y-10 text-dark/70 leading-relaxed">

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using the Cobblestone Creamery website, online ordering platform, or SMS
                messaging program, you agree to be bound by these Terms &amp; Conditions. If you do not agree
                with any part of these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Online Ordering</h2>
              <p className="mb-4">
                When you place an order through our online ordering platform, you agree to provide accurate
                and complete information, including your name, phone number, delivery address (if applicable),
                and payment details.
              </p>
              <p className="mb-4">
                All orders are subject to availability. We reserve the right to refuse or cancel any order
                for any reason, including but not limited to product availability, errors in pricing, or
                suspected fraudulent activity.
              </p>
              <p>
                Prices displayed on our website are subject to change without notice. Sales tax will be
                applied where applicable.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">SMS Messaging Terms</h2>
              <p className="mb-4">
                <span className="font-medium text-dark">Program Name:</span> Cobblestone Creamery Alerts
              </p>
              <p className="mb-4">
                By opting in to our SMS messaging program, you consent to receive recurring automated
                text messages from Cobblestone Creamery at the mobile number you provide. These messages
                may include order updates, promotional offers, loyalty rewards notifications, and store
                announcements. Consent to receive marketing text messages is not a condition of any purchase.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Message Frequency:</span> Message frequency varies.
                You may receive up to 8 messages per month depending on order activity, promotions, and
                account updates.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Message &amp; Data Rates:</span> Standard message and
                data rates may apply. Your wireless carrier&apos;s messaging rates apply to any messages you
                send or receive. Please contact your wireless carrier for details about your text messaging
                plan.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Opt-Out:</span> You may opt out of receiving SMS
                messages at any time by replying <strong>STOP</strong> to any message you receive from us.
                After opting out, you will receive a single confirmation message and will no longer receive
                SMS messages from Cobblestone Creamery unless you re-subscribe.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Help:</span> For assistance with our SMS program,
                reply <strong>HELP</strong> to any message you receive from us, or contact us directly at{' '}
                <a href="mailto:info@cobblestonecreamery.com" className="text-primary hover:text-gold transition-colors">
                  info@cobblestonecreamery.com
                </a>{' '}
                or{' '}
                <a href="tel:8124999866" className="text-primary hover:text-gold transition-colors">
                  (812) 499-9866
                </a>.
              </p>
              <p>
                <span className="font-medium text-dark">Supported Carriers:</span> Compatible with major
                US carriers including AT&amp;T, Verizon, T-Mobile, Sprint, and others. Carriers are not
                liable for delayed or undelivered messages.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Loyalty Program</h2>
              <p className="mb-4">
                Participation in our loyalty rewards program is voluntary. Points are earned on qualifying
                purchases and may be redeemed according to the program rules displayed at the time of
                redemption. We reserve the right to modify, suspend, or discontinue the loyalty program
                at any time.
              </p>
              <p>
                Loyalty points have no cash value and cannot be transferred, sold, or exchanged outside
                of the Cobblestone Creamery loyalty program.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of
                Cobblestone Creamery and is protected by applicable intellectual property laws. You may not
                reproduce, distribute, or use any content without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Limitation of Liability</h2>
              <p>
                Cobblestone Creamery shall not be liable for any indirect, incidental, special, or
                consequential damages arising from your use of our website, online ordering platform,
                or SMS messaging program. Our total liability for any claim shall not exceed the amount
                you paid for the specific product or service giving rise to the claim.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Changes to These Terms</h2>
              <p>
                We reserve the right to update or modify these Terms &amp; Conditions at any time. Changes
                will be effective immediately upon posting to this page. Your continued use of our services
                after any changes constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Contact Us</h2>
              <p>
                If you have questions about these Terms &amp; Conditions, please contact us at:
              </p>
              <div className="mt-4 bg-cream rounded px-6 py-5">
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

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
