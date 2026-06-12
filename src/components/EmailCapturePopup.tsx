'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cc_email_popup_dismissed';
const DELAY_MS = 4_000;

export default function EmailCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // storage blocked — just show popup
    }
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        {/* Top bar */}
        <div className="bg-[linear-gradient(135deg,#10243f_0%,#1d466f_100%)] px-8 pt-8 pb-6 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#c9912f]">Cobblestone Crew</p>
          <h2
            id="popup-title"
            className="mt-2 text-4xl font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: 'var(--font-display, system-ui)' }}
          >
            Get A Free Topping
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Join the list — we'll send new flavors, promos, and a free topping on your next visit.
          </p>
        </div>

        {/* Form area */}
        <div className="px-8 py-7">
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#10243f] focus:ring-2 focus:ring-[#10243f]/10"
                />
                <input
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={120}
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#10243f] focus:ring-2 focus:ring-[#10243f]/10"
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
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
