'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { SMS_CONSENT_DISCLOSURE, PRIVACY_POLICY_URL, TERMS_URL } from '@/lib/smsConsent';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/+$/, '');

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

const RESET_DELAY_MS = 5000;

export default function LoyaltyKioskPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(RESET_DELAY_MS / 1000);

  const isFormValid = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    const phoneDigits = normalizePhone(phone);
    return name.trim().length > 1 && emailOk && phoneDigits.length >= 10;
  }, [email, name, phone]);

  // Auto-reset after successful submission
  useEffect(() => {
    if (!submitted) return;
    setCountdown(RESET_DELAY_MS / 1000);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    const timeout = setTimeout(() => {
      resetForm();
    }, RESET_DELAY_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [submitted]);

  function resetForm() {
    setName('');
    setPhone('');
    setEmail('');
    setSmsOptIn(false);
    setSubmitted(false);
    setErrorMessage('');
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isFormValid) {
      setErrorMessage('Please fill in your name, email address, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedName = name.trim();
      const nameParts = trimmedName.split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || undefined;

      // POST to the loyalty system — creates/updates the customer record in
      // the `customers` collection with loyaltyPoints: 0 on new accounts.
      // smsOptIn is stored on the customer so only opted-in members get texts.
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
          source: 'loyalty_kiosk',
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your loyalty profile.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Loyalty kiosk signup failed', error);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-light-cream px-6 py-10 text-center sm:px-8">
        <Image
          src="/logo.png"
          alt="Cobblestone Creamery"
          width={180}
          height={180}
          className="h-36 w-auto mb-8"
          priority
        />
        <div className="text-7xl mb-6">🍦</div>
        <h1 className="font-serif text-5xl text-primary mb-4">You&rsquo;re In!</h1>
        <p className="text-xl text-dark/60 mb-2">Welcome to the Cobblestone Creamery family.</p>
        {smsOptIn && (
          <p className="text-base text-dark/50 mt-1">You&rsquo;re signed up for text updates too.</p>
        )}
        <p className="mt-10 text-sm text-dark/40">
          Returning to signup in {countdown}…
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 text-sm text-primary underline underline-offset-4 hover:text-gold transition-colors"
        >
          Sign up another person now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-light-cream">

      {/* Header */}
      <header className="flex flex-col items-center pt-10 pb-6 border-b border-cream bg-white">
        <Image
          src="/logo.png"
          alt="Cobblestone Creamery"
          width={180}
          height={180}
          className="h-28 w-auto mb-5"
          priority
        />
        <h1 className="font-serif text-4xl md:text-5xl text-primary text-center">
          Join Our Loyalty Program
        </h1>
        <p className="mt-2 text-dark/50 text-lg">Sign up to earn rewards on every visit.</p>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-xl space-y-6"
        >

          <div>
            <label htmlFor="kiosk-name" className="block text-base font-semibold uppercase tracking-widest text-primary mb-2">
              Full Name <span className="text-dugout-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="kiosk-name"
              autoComplete="name"
              required
              placeholder="Your full name"
              className="w-full rounded-xl border-2 border-cream bg-white px-5 py-4 text-xl text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="kiosk-phone" className="block text-base font-semibold uppercase tracking-widest text-primary mb-2">
              Phone Number <span className="text-dugout-red">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="kiosk-phone"
              autoComplete="tel"
              required
              placeholder="(812) 555-1234"
              className="w-full rounded-xl border-2 border-cream bg-white px-5 py-4 text-xl text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="kiosk-email" className="block text-base font-semibold uppercase tracking-widest text-primary mb-2">
              Email Address <span className="text-dugout-red">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="kiosk-email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border-2 border-cream bg-white px-5 py-4 text-xl text-dark placeholder:text-dark/30 focus:border-gold focus:outline-none"
            />
          </div>

          {/* SMS opt-in — unchecked by default */}
          <label className="flex items-start gap-4 rounded-xl border-2 border-cream bg-white p-5 cursor-pointer hover:border-gold/50 transition-colors select-none">
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
                className="h-6 w-6 accent-gold cursor-pointer"
              />
            </div>
            <span className="text-base text-dark/70 leading-relaxed">
              <span className="block font-semibold text-dark mb-1">Sign me up for text message updates (optional)</span>
              {SMS_CONSENT_DISCLOSURE}
              <span className="mt-2 block text-sm text-dark/50">
                Privacy Policy: {PRIVACY_POLICY_URL} Terms: {TERMS_URL}
              </span>
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-dugout-red/30 bg-dugout-red/10 px-5 py-4 text-base text-dugout-red">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full rounded-full bg-gold px-8 py-5 text-xl font-bold uppercase tracking-widest text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? 'Signing Up…' : 'Join Now'}
          </button>

          <p className="text-center text-sm text-dark/40 pb-4">
            Text messaging is optional — you can join without opting in.
          </p>

        </form>
      </main>

    </div>
  );
}
