'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { isDisplayRoute } from '@/lib/displayRoutes';

const STORAGE_KEY = 'cc_email_popup_dismissed';
const DELAY_MS = 4_000;

export default function EmailCapturePopup() {
  const pathname = usePathname();
  const onDisplayRoute = isDisplayRoute(pathname);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Unattended TV/kiosk screens have nobody to dismiss a popup.
    if (onDisplayRoute) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // storage blocked — just show popup
    }
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [onDisplayRoute]);

  const dismiss = useCallback((permanent = false) => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
      if (permanent) localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, source: 'website_popup' }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Something went wrong');
      }

      setStatus('success');
      // Permanently dismiss after successful signup
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      setTimeout(() => setVisible(false), 3_000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      /* overflow-y-auto + items-start on small screens: the card is ~470px
         tall, so on a landscape phone (or once the iOS keyboard opens) a
         centred non-scrolling flex box clipped both the submit button and the
         close button, leaving the user stuck. */
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain p-4 py-8 sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Card */}
      <div className="relative my-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        {/* Top bar */}
        <div className="bg-[linear-gradient(135deg,#10243f_0%,#1d466f_100%)] px-6 pt-7 pb-5 text-center sm:px-8 sm:pt-8 sm:pb-6">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#c9912f] sm:text-[0.7rem] sm:tracking-[0.32em]">Cobblestone Crew</p>
          <h2
            id="popup-title"
            className="mt-2 text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-display, system-ui)' }}
          >
            Get A Free Topping
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Join the list — we'll send new flavors, promos, and a free topping on your next visit.
          </p>
        </div>

        {/* Form area */}
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          {status === 'success' ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
                🍦
              </div>
              <p className="text-lg font-semibold text-[#10243f]">You're in!</p>
              <p className="mt-2 text-sm text-gray-500">
                Check your inbox — your free topping offer is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={80}
                  autoComplete="given-name"
                  autoCapitalize="words"
                  /* 16px minimum — text-sm (14px) makes iOS Safari zoom the
                     page in on focus and it never zooms back out. */
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-[#10243f] focus:ring-2 focus:ring-[#10243f]/10"
                />
                <input
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={120}
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-[#10243f] focus:ring-2 focus:ring-[#10243f]/10"
                />
              </div>

              {status === 'error' && (
                <p className="mt-2 text-xs text-red-600" role="alert">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="mt-4 w-full rounded-full bg-[#b33a2f] py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#ca4438] disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Claim My Free Topping'}
              </button>

              <p className="mt-3 text-center text-[0.68rem] text-gray-400">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => dismiss(true)}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
