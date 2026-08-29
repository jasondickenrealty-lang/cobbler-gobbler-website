'use client';
/**
 * NmiPaymentForm
 *
 * Ported from online-ordering/src/components/NmiPaymentForm.tsx, restyled for
 * the website's palette. Loads NMI's Collect.js (PCI-compliant hosted card
 * entry), renders the card fields in secure iframes, and calls
 * onTokenized(token) once the customer submits a valid card.
 *
 * The public tokenization key comes from GET /nmi/config (safe to expose).
 * The secret NMI security key never touches the browser.
 *
 * Collect.js docs: https://docs.nmi.com/docs/collect-js
 */
import { useEffect, useRef, useState } from 'react';

interface NmiPaymentFormProps {
  tokenizationKey: string;
  environment?: 'sandbox' | 'production';
  /** Display only, e.g. "128.50" */
  amount: string;
  onTokenized: (token: string) => void;
  onError: (message: string) => void;
  processing: boolean;
  disabled?: boolean;
  /** Verb on the button. A guest places a hold; a host pays outright. */
  action?: string;
  /** Reassurance under the card fields, e.g. what a hold means. */
  note?: string;
}

interface CollectJsResponse {
  token: string;
  card?: { number: string; bin: string; exp: string; type: string };
}

declare global {
  interface Window {
    CollectJS?: { configure: (opts: object) => void };
  }
}

const COLLECT_JS_URLS: Record<'production' | 'sandbox', string[]> = {
  production: [
    'https://secure.nmi.com/token/Collect.js',
    'https://secure.networkmerchants.com/token/Collect.js',
  ],
  sandbox: [
    'https://sandbox.nmi.com/token/Collect.js',
    'https://test.networkmerchants.com/token/Collect.js',
  ],
};

const PAY_BUTTON_ID = 'op-nmi-pay-button';

export default function NmiPaymentForm({
  tokenizationKey,
  environment = 'production',
  amount,
  onTokenized,
  onError,
  processing,
  disabled = false,
  action = 'Pay',
  note,
}: NmiPaymentFormProps) {
  const collectJsUrls = COLLECT_JS_URLS[environment] ?? COLLECT_JS_URLS.production;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const configured = useRef(false);
  const submitTimeoutRef = useRef<number | null>(null);

  const clearSubmitTimeout = () => {
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  };

  // Keep stable refs to callbacks so Collect.js isn't reconfigured every render.
  const onTokenizedRef = useRef(onTokenized);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onTokenizedRef.current = onTokenized;
  }, [onTokenized]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // ── Load Collect.js once ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setScriptLoaded(false);
    setScriptError(false);

    if (window.CollectJS) {
      setScriptLoaded(true);
      return;
    }

    const tryLoad = (index: number) => {
      if (cancelled || index >= collectJsUrls.length) {
        setScriptError(true);
        return;
      }
      const url = collectJsUrls[index];
      const existing = document.querySelector(
        `script[src="${url}"]`
      ) as HTMLScriptElement | null;

      const onLoad = () => {
        if (!cancelled) {
          setScriptLoaded(true);
          setScriptError(false);
        }
      };
      const onErr = () => {
        if (!cancelled) tryLoad(index + 1);
      };

      if (existing) {
        existing.addEventListener('load', onLoad, { once: true });
        existing.addEventListener('error', onErr, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.setAttribute('data-tokenization-key', tokenizationKey);
      script.async = true;
      script.onload = onLoad;
      script.onerror = onErr;
      document.head.appendChild(script);
    };

    tryLoad(0);
    return () => {
      cancelled = true;
    };
  }, [tokenizationKey, collectJsUrls]);

  useEffect(() => () => clearSubmitTimeout(), []);

  // ── Configure Collect.js after it loads ───────────────────────────────────
  useEffect(() => {
    if (!scriptLoaded || !window.CollectJS || configured.current) return;
    configured.current = true;

    window.CollectJS.configure({
      paymentSelector: `#${PAY_BUTTON_ID}`,
      variant: 'inline',
      styleSniffer: false,
      fields: {
        ccnumber: {
          selector: '#op-nmi-ccnumber',
          title: 'Card Number',
          placeholder: '0000 0000 0000 0000',
        },
        ccexp: { selector: '#op-nmi-ccexp', title: 'Expiration', placeholder: 'MM / YY' },
        cvv: { selector: '#op-nmi-cvv', title: 'CVV', placeholder: '123' },
      },
      callback: (response: CollectJsResponse) => {
        clearSubmitTimeout();
        setSubmitting(false);
        if (response && response.token) {
          onTokenizedRef.current(response.token);
        } else {
          setValidationError('Card entry failed. Please check your details and try again.');
        }
      },
      validationCallback: (_field: string, _status: boolean, message: string) => {
        clearSubmitTimeout();
        setSubmitting(false);
        setValidationError(message || null);
      },
      fieldsAvailableCallback: () => {
        /* iframes ready */
      },
    });
  }, [scriptLoaded]);

  if (scriptError) {
    return (
      <div className="rounded-xl border border-dugout-red/30 bg-dugout-red/5 p-5 text-center">
        <p className="text-sm text-dark/70">
          We could not load secure card entry. Please refresh, or call us at{' '}
          <a href="tel:+18124999866" className="font-semibold text-primary underline">
            (812) 499-9866
          </a>{' '}
          to book by phone.
        </p>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <p className="py-5 text-center text-sm text-dark/50">Loading secure card entry…</p>
    );
  }

  const busy = submitting || processing;

  return (
    <div className="space-y-4">
      <p className="text-xs text-dark/60">
        Card details are entered securely through NMI and never touch our servers.
        {note ? ` ${note}` : ' Your order is only saved after the card is approved.'}
      </p>

      {/* Collect.js injects secure iframes into these containers */}
      <div>
        <label htmlFor="op-nmi-ccnumber" className="mb-1 block text-sm font-medium text-dark/70">
          Card Number
        </label>
        <div
          id="op-nmi-ccnumber"
          className="flex h-12 items-center rounded-lg border border-dark/15 bg-white px-3"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="op-nmi-ccexp" className="mb-1 block text-sm font-medium text-dark/70">
            Expiration
          </label>
          <div
            id="op-nmi-ccexp"
            className="flex h-12 items-center rounded-lg border border-dark/15 bg-white px-3"
          />
        </div>
        <div>
          <label htmlFor="op-nmi-cvv" className="mb-1 block text-sm font-medium text-dark/70">
            CVV
          </label>
          <div
            id="op-nmi-cvv"
            className="flex h-12 items-center rounded-lg border border-dark/15 bg-white px-3"
          />
        </div>
      </div>

      {validationError && <p className="text-sm text-dugout-red">{validationError}</p>}

      <button
        id={PAY_BUTTON_ID}
        type="button"
        disabled={disabled || busy}
        onClick={() => {
          if (disabled) {
            onErrorRef.current('Please complete the required fields above before paying.');
            return;
          }
          if (busy) return;
          clearSubmitTimeout();
          setValidationError(null);
          setSubmitting(true);
          // Release the UI if Collect.js never fires a callback.
          submitTimeoutRef.current = window.setTimeout(() => {
            setSubmitting(false);
            setValidationError(
              'Secure card entry timed out. Please re-check the card fields and try again.'
            );
          }, 15000);
        }}
        className="min-h-[52px] w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-bold text-cream transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Processing…' : `${action} $${amount}`}
      </button>
    </div>
  );
}
