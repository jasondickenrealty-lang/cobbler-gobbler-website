import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ORDER_ONLINE_URL } from '@/lib/links';

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
                  localhost:3001/auth
                </a>, customers are presented with an optional SMS consent checkbox. The checkbox is unchecked by
                default and must be actively selected by the user. Consent is not required to make a purchase.
              </p>

              {/* Screenshot mockup of the signup form */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-primary px-6 py-3">
                  <span className="text-white font-serif text-sm">localhost:3001/auth</span>
                </div>
                <div className="bg-white p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Cobblestone Creamery Account</h3>

                  <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">Log In</span>
                    <span className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm">Create Account</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                      <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400 text-sm">&nbsp;</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                      <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400 text-sm">(812) 205-3322</div>
                    </div>

                    {/* SMS Consent - highlighted */}
                    <div className="border-2 border-gold rounded-lg p-4 bg-gold/5">
                      <p className="text-sm font-bold text-gray-800 mb-2">
                        Stay in the Scoop with Cobblestone Creamery!
                      </p>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="mt-0.5 w-4 h-4 border-2 border-gray-400 rounded-sm flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          Yes, sign me up! I&apos;d like to receive SMS messages from Cobblestone Creamery
                          about promotions, loyalty rewards, order updates, and special store
                          announcements.
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        Message &amp; data rates may apply. Reply STOP at any time to unsubscribe.
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Consent is not a condition of purchase. Your phone number will still be
                        used for loyalty account access and order lookups.
                      </p>
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wide">&#8593; SMS Opt-In checkbox (unchecked by default)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Email</label>
                      <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400 text-sm">&nbsp;</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Password</label>
                      <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400 text-sm">&nbsp;</div>
                    </div>
                    <div className="bg-gray-900 text-white text-center py-2.5 rounded text-sm font-medium">
                      Create Account
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Consent Language</h2>
              <div className="bg-cream rounded px-6 py-5">
                <p className="text-dark font-medium mb-2">Exact opt-in text shown to users:</p>
                <p className="italic mb-2">
                  &ldquo;Stay in the Scoop with Cobblestone Creamery!
                </p>
                <p className="italic mb-2">
                  Would you like to receive SMS messages from Cobblestone Creamery
                  about promotions, loyalty rewards, order updates, and special store
                  announcements?
                </p>
                <p className="italic mb-2">
                  Message &amp; data rates may apply. Reply STOP at any time to unsubscribe.
                </p>
                <p className="italic">
                  Consent is not a condition of purchase. Your phone number will still be
                  used for loyalty account access and order lookups.&rdquo;
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
