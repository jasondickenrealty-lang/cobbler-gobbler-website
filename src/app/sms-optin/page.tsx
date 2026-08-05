import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ORDER_ONLINE_URL } from '@/lib/links';
import { SMS_CONSENT_DISCLOSURE, PRIVACY_POLICY_URL, TERMS_URL } from '@/lib/smsConsent';

// This page is the CTA proof a carrier reviewer loads during A2P 10DLC review.
// It is a server component rendering plain <img> and <a> tags on purpose: it has
// to be readable with JavaScript disabled, with no login, no cart, and no
// client-side gating of any kind. Do not make it a client component, and do not
// move any of the disclosure text behind an interaction.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'SMS Program Opt-In — Cobblestone Creamery Alerts',
  description:
    'How customers opt in to Cobblestone Creamery Alerts SMS messages, the exact consent language shown at each sign-up point, and program terms.',
  alternates: {
    canonical: 'https://cobblestonecreamery.com/sms-optin',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'SMS Program Opt-In — Cobblestone Creamery Alerts',
    description:
      'How customers opt in to Cobblestone Creamery Alerts SMS messages, the exact consent language shown at each sign-up point, and program terms.',
    url: 'https://cobblestonecreamery.com/sms-optin',
    images: [{ url: '/logo.png', alt: 'Cobblestone Creamery SMS opt-in consent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMS Program Opt-In — Cobblestone Creamery Alerts',
    description:
      'How customers opt in to Cobblestone Creamery Alerts SMS messages, the exact consent language shown at each sign-up point, and program terms.',
    images: ['/logo.png'],
  },
};

/**
 * The consent disclosure exactly as it is rendered beside every opt-in checkbox.
 * Sourced from the shared constant so this page cannot drift from the live
 * forms — a mismatch between the two is a CTA-verification failure.
 */
function DisclosureBlock() {
  return (
    <blockquote className="bg-cream rounded px-6 py-5 border-l-4 border-gold not-italic">
      <p className="text-dark leading-relaxed">{SMS_CONSENT_DISCLOSURE}</p>
      <p className="text-dark leading-relaxed mt-3 break-words">
        Privacy Policy:{' '}
        <a href={PRIVACY_POLICY_URL} className="text-primary hover:text-gold transition-colors underline">
          {PRIVACY_POLICY_URL}
        </a>{' '}
        Terms:{' '}
        <a href={TERMS_URL} className="text-primary hover:text-gold transition-colors underline">
          {TERMS_URL}
        </a>
      </p>
    </blockquote>
  );
}

export default function SmsOptInPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-3xl md:text-5xl font-serif text-primary mb-6">
              SMS Program Opt-In — Cobblestone Creamery Alerts
            </h1>
            <p className="text-dark/60">
              Consent documentation for the Cobblestone Creamery Alerts messaging program
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 space-y-12 text-dark/70 leading-relaxed">

            {/* 2. Program description */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">About This Program</h2>
              <p className="mb-4">
                Customers who opt in receive recurring automated text messages from{' '}
                <strong className="text-dark">Cobblestone Creamery LLC</strong>, 900 Main Street,
                Evansville, IN 47708. Messages include order updates, promotional offers, loyalty
                rewards, and store announcements.
              </p>
              <p>
                Consent is not a condition of purchase. Message frequency varies, up to 8
                msgs/month. Msg &amp; data rates may apply. Reply <strong className="text-dark">STOP</strong>{' '}
                to cancel, <strong className="text-dark">HELP</strong> for help.
              </p>
            </div>

            {/* 3. Online ordering opt-in */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Online Ordering Opt-In</h2>
              <p className="mb-6">
                Customers ordering at{' '}
                <a href={ORDER_ONLINE_URL} className="text-primary hover:text-gold transition-colors font-medium">
                  order.cobblestonecreamery.com
                </a>{' '}
                are shown an optional SMS consent checkbox in the Contact Info step of checkout,
                directly beneath the mobile number field. The checkbox is unchecked by default,
                is never pre-selected, and leaving it unchecked does not prevent the order from
                being placed.
              </p>

              <figure className="mb-8">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/assets/cobblestone-sms-optin-checkout.png"
                    alt="Screenshot of the Cobblestone Creamery online checkout page showing the unchecked SMS opt-in checkbox and its full consent disclosure beneath the phone number field"
                    width={1000}
                    height={900}
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="text-sm text-dark/50 mt-2">
                  Checkout at order.cobblestonecreamery.com — SMS consent checkbox, unchecked by default.
                </figcaption>
              </figure>

              <p className="mb-4 font-medium text-dark">
                Disclosure text shown next to the checkbox:
              </p>
              <DisclosureBlock />

              <p className="mt-8 mb-6">
                The same optional, unchecked consent checkbox and the same disclosure text also
                appear when a customer creates an online ordering account.
              </p>

              {/* DO NOT DELETE: This image is required for SMS compliance and must remain accessible at /assets/cobblestone-sms-optin.png */}
              <figure>
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/assets/cobblestone-sms-optin.png"
                    alt="Screenshot of Cobblestone Creamery account creation form showing the unchecked SMS opt-in checkbox"
                    width={1000}
                    height={1800}
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="text-sm text-dark/50 mt-2">
                  Account creation at order.cobblestonecreamery.com — SMS consent checkbox, unchecked by default.
                </figcaption>
              </figure>
            </div>

            {/* 4. In-store sign-up */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">In-Store Sign-Up Form</h2>
              <p className="mb-6">
                Customers who join in person at 900 Main Street, Evansville, IN 47708 sign
                themselves up on a self-service kiosk screen at the counter. The kiosk displays the
                web form below, which is publicly viewable at{' '}
                <a href="/loyalty-kiosk" className="text-primary hover:text-gold transition-colors font-medium">
                  cobblestonecreamery.com/loyalty-kiosk
                </a>{' '}
                and may be loaded directly by a reviewer. The customer enters their own name, phone
                number, and email, then chooses whether to check the SMS consent box, which is
                unchecked by default. Staff do not check the box on a customer&apos;s behalf, and
                declining it does not affect loyalty enrollment.
              </p>
              <p className="mb-6">
                <strong className="text-dark">Cobblestone Creamery does not collect SMS consent on
                paper.</strong> There is no paper sign-up sheet, and consent is never gathered
                verbally or over the phone. Every opt-in comes from one of the web forms documented
                on this page.
              </p>

              <figure className="mb-8">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/sms-optin-form.jpg"
                    alt="Photo of the in-store self-service sign-up kiosk form at Cobblestone Creamery showing the unchecked SMS consent checkbox and full disclosure text"
                    width={1000}
                    height={1200}
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="text-sm text-dark/50 mt-2">
                  In-store sign-up kiosk at 900 Main Street — SMS consent checkbox, unchecked by
                  default. Also available at{' '}
                  <a href="/sms-optin-form.jpg" className="text-primary hover:text-gold transition-colors underline">
                    cobblestonecreamery.com/sms-optin-form.jpg
                  </a>
                </figcaption>
              </figure>

              <p className="mb-4 font-medium text-dark">
                Disclosure text shown next to the checkbox:
              </p>
              <DisclosureBlock />
            </div>

            {/* Program details */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Program Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark">Program Name:</span> Cobblestone Creamery Alerts</p>
                <p><span className="font-medium text-dark">Brand:</span> Cobblestone Creamery LLC, 900 Main Street, Evansville, IN 47708</p>
                <p><span className="font-medium text-dark">Message Types:</span> Order updates, promotional offers, loyalty rewards, store announcements</p>
                <p><span className="font-medium text-dark">Message Frequency:</span> Varies, up to 8 messages per month</p>
                <p><span className="font-medium text-dark">Cost:</span> Msg &amp; data rates may apply</p>
                <p><span className="font-medium text-dark">Opt-Out:</span> Reply STOP to cancel</p>
                <p><span className="font-medium text-dark">Help:</span> Reply HELP for help, or contact us below</p>
                <p><span className="font-medium text-dark">Consent:</span> Not a condition of purchase</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Contact Information</h2>
              <div className="bg-cream rounded px-6 py-5">
                <p className="font-medium text-dark">Cobblestone Creamery LLC</p>
                <p>900 Main Street, Evansville, Indiana 47708</p>
                {/*
                  Cloudflare's Email Address Obfuscation rewrites plain mailto
                  links into <span class="__cf_email__">[email protected]</span>
                  and relies on its own JS to restore them. This page has to stay
                  readable with JavaScript disabled, so an obfuscated address
                  would show a carrier reviewer the literal string
                  "[email protected]" plus a link that 404s. The email_off
                  directive is Cloudflare's supported way to exempt a region;
                  it needs a raw HTML comment, which JSX can only emit this way.
                */}
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      '<!--email_off-->' +
                      '<a href="mailto:info@cobblestonecreamery.com" class="text-primary hover:text-gold transition-colors">' +
                      'info@cobblestonecreamery.com' +
                      '</a>' +
                      '<!--email_on-->',
                  }}
                />
                <p>
                  <a href="tel:8124999866" className="text-primary hover:text-gold transition-colors">
                    (812) 499-9866
                  </a>
                </p>
              </div>
            </div>

            {/* 5. Policy links */}
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Related Policies</h2>
              <div className="flex flex-col gap-2">
                <a href="/privacy" className="text-primary hover:text-gold transition-colors font-medium break-words">
                  Privacy Policy — {PRIVACY_POLICY_URL}
                </a>
                <a href="/terms" className="text-primary hover:text-gold transition-colors font-medium break-words">
                  Terms &amp; Conditions — {TERMS_URL}
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
