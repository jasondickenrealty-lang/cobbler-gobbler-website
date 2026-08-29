import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Cobblestone Creamery',
  description:
    'Read Cobblestone Creamery\'s privacy policy for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Cobblestone Creamery',
    description:
      'Read Cobblestone Creamery\'s privacy policy for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
    url: 'https://cobblestonecreamery.com/privacy',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery privacy policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Cobblestone Creamery',
    description:
      'Read Cobblestone Creamery\'s privacy policy for website use, online ordering, loyalty, and SMS messaging in Evansville, Indiana.',
    images: ['/logo.png'],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Privacy Policy</h1>
            <p className="text-dark/60">Last updated: February 18, 2026</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 space-y-10 text-dark/70 leading-relaxed">

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Introduction</h2>
              <p>
                Cobblestone Creamery (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to
                protecting the personal information you share with us. This Privacy Policy explains how we
                collect, use, and safeguard your information when you visit our website, use our online
                ordering platform, or participate in our SMS messaging program.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Information We Collect</h2>
              <p className="mb-4">We may collect the following personal information:</p>
              <ul className="list-disc list-outside space-y-2 pl-5">
                <li>Name and contact information (email address, phone number)</li>
                <li>Delivery address when placing orders</li>
                <li>Order history and preferences</li>
                <li>Payment information (processed securely through Stripe; we do not store card details)</li>
                <li>Loyalty program activity and points balance</li>
                <li>SMS opt-in status and consent records</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">SMS Messaging Program</h2>
              <p className="mb-4">
                <span className="font-medium text-dark">Program Name:</span> Cobblestone Creamery Alerts
              </p>
              <p className="mb-4">
                When you opt in to our SMS messaging program, you consent to receive recurring
                automated text messages from Cobblestone Creamery. These messages may include:
              </p>
              <ul className="list-disc list-outside space-y-2 pl-5 mb-4">
                <li>Order confirmations and status updates</li>
                <li>Promotional offers and discounts</li>
                <li>Loyalty rewards notifications</li>
                <li>Store announcements (hours changes, new flavors, special events)</li>
              </ul>
              <p className="mb-4">
                <span className="font-medium text-dark">Message Frequency:</span> Message frequency varies.
                You may receive up to 8 messages per month depending on order activity, promotions, and
                account updates.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Message &amp; Data Rates:</span> Standard message and
                data rates may apply. Please contact your wireless carrier for details about your messaging
                plan.
              </p>
              <p className="mb-4">
                <span className="font-medium text-dark">Opt-Out:</span> You can opt out of SMS messages at any
                time by texting <strong>STOP</strong> to the number from which you received the message. You
                will receive a one-time confirmation message, and no further messages will be sent unless you
                re-subscribe.
              </p>
              <p>
                <span className="font-medium text-dark">Help:</span> For help or questions about our SMS
                program, text <strong>HELP</strong> to the number from which you received the message, or
                contact us at{' '}
                <a href="mailto:cobblestonecreameryllc@gmail.com" className="text-primary hover:text-gold transition-colors">
                  cobblestonecreameryllc@gmail.com
                </a>{' '}
                or{' '}
                <a href="tel:8124999866" className="text-primary hover:text-gold transition-colors">
                  (812) 499-9866
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-outside space-y-2 pl-5">
                <li>Process and fulfill your orders</li>
                <li>Send transactional messages (order confirmations, delivery updates)</li>
                <li>Send promotional messages if you have opted in</li>
                <li>Manage your loyalty rewards account</li>
                <li>Improve our products, services, and website</li>
                <li>Respond to your questions and customer service requests</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share
                your information only with trusted service providers who assist us in operating our business
                (e.g., payment processing, order delivery, SMS messaging services). These providers are
                obligated to keep your information confidential and use it solely for the services they
                provide to us.
              </p>
              <p>
                No mobile information will be shared with third parties or affiliates for marketing or
                promotional purposes. All other use case categories exclude text messaging originator opt-in
                data and consent; this information will not be shared with any third parties.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-outside space-y-2 pl-5 mt-4">
                <li>Access and review the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of promotional communications at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 bg-cream rounded px-6 py-5">
                <p className="font-medium text-dark">Cobblestone Creamery</p>
                <p>900 Main Street, Evansville, Indiana 47708</p>
                <p>
                  <a href="mailto:cobblestonecreameryllc@gmail.com" className="text-primary hover:text-gold transition-colors">
                    cobblestonecreameryllc@gmail.com
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
