'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/+$/, '');

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

export default function LoyaltySignupPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    const phoneDigits = normalizePhone(phone);
    return name.trim().length > 1 && emailOk && phoneDigits.length >= 10;
  }, [email, name, phone]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!isFormValid) {
      setErrorMessage('Please fill in your name, a valid email address, and a 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedName = name.trim();
      const nameParts = trimmedName.split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || undefined;

      // POST to the loyalty system — creates/updates the customer record with
      // loyaltyPoints: 0 on new accounts. smsOptIn stored so opted-out members
      // are never sent texts.
      const response = await fetch(`${API_BASE}/public/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: trimmedName,
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          phone,
          smsOptIn,
          emailOptIn: false,
          source: 'loyalty_signup',
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your loyalty profile.');
      }

      setName('');
      setPhone('');
      setEmail('');
      setBirthday('');
      setSmsOptIn(false);
      setSuccessMessage("You're in! Welcome to the Cobblestone Creamery loyalty program.");
    } catch (error) {
      console.error('Loyalty signup failed', error);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-light-cream border-b border-cream">
          <div className="max-w-xl mx-auto px-6 py-14 text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.png"
                alt="Cobblestone Creamery"
                width={160}
                height={160}
                className="h-32 w-auto"
                priority
              />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-3">
              Join Our Loyalty Program
            </h1>
            <p className="text-dark/60 text-lg leading-relaxed">
              Sign up once. Earn rewards every visit. We&rsquo;ll take it from there.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="bg-white">
          <div className="max-w-lg mx-auto px-6 py-14">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              <label className="block">
                <span className="block text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Full Name <span className="text-dugout-red">*</span>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-cream bg-light-cream px-4 py-3 text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Phone Number <span className="text-dugout-red">*</span>
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  placeholder="(812) 555-1234"
                  className="w-full rounded-lg border border-cream bg-light-cream px-4 py-3 text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Email Address <span className="text-dugout-red">*</span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-cream bg-light-cream px-4 py-3 text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Birthday <span className="text-dark/40 normal-case font-normal tracking-normal">(optional — we love to celebrate)</span>
                </span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-lg border border-cream bg-light-cream px-4 py-3 text-dark focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* SMS opt-in — unchecked by default; only members with smsOptIn=true receive texts */}
              <label className="flex items-start gap-3 rounded-xl border border-cream bg-light-cream p-4 cursor-pointer select-none hover:border-gold/50 transition-colors">
                <input
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-gold flex-shrink-0"
                />
                <span className="text-sm text-dark/70 leading-relaxed">
                  I agree to receive recurring SMS messages from Cobblestone Creamery regarding
                  promotions, loyalty rewards, order updates, and store announcements. Consent is
                  not a condition of purchase. Message and data rates may apply. Reply{' '}
                  <strong>STOP</strong> to unsubscribe or <strong>HELP</strong> for help.{' '}
                  <a href="/sms-optin" className="text-primary underline hover:text-gold transition-colors">
                    SMS details
                  </a>
                  .
                </span>
              </label>

              {errorMessage ? (
                <p className="rounded-lg border border-dugout-red/30 bg-dugout-red/10 px-4 py-3 text-sm text-dugout-red">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <div className="rounded-lg border border-green-400/50 bg-green-50 px-4 py-3 text-sm text-green-800 font-medium">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Signing up…' : 'Join Now'}
              </button>

              <p className="text-center text-xs text-dark/40 leading-relaxed">
                Text messaging is optional. You can join the loyalty program without opting in to SMS.
              </p>

            </form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
