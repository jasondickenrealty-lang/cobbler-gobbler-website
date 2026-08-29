'use client';

/**
 * The shared office party page.
 *
 * Everyone who has the link lands here: coworkers add their own order, and the
 * host — recognised by the ?host= token in the URL — additionally sees the
 * settle controls when the company is paying. What each person may see is
 * decided by the server, not by hiding things in this file.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { MenuData } from '@/lib/menu-data';
import {
  MIN_SUBTOTAL_CENTS,
  SLOT_LABELS,
  formatDateKey,
  AUTH_HOLD_DAYS,
  type BillingMode,
} from '@/lib/partySlots';
import NmiPaymentForm from './NmiPaymentForm';
import {
  MenuPicker,
  CartLines,
  Field,
  useCart,
  cartSubtotal,
  cartToItems,
  money,
} from './MenuPicker';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/+$/, '');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PartyGuest {
  id: string;
  guestName: string;
  itemCount: number;
  items: { name: string; quantity: number; modifiers: string[] }[];
  total: number;
  paymentStatus: string;
}

interface PartyView {
  id: string;
  reservationNumber: string;
  businessName: string;
  businessAddress: string;
  buildingLocation: string | null;
  hostName: string;
  billingMode: BillingMode;
  eventDateKey: string;
  eventTime: string;
  status: string;
  paymentStatus: string;
  specialRequests: string | null;
  subtotal: number;
  tax: number;
  total: number;
  guestCount: number;
  minSubtotalCents: number;
  minimumMet: boolean;
  shortfall: number;
  guests: PartyGuest[];
  orderingOpen: boolean;
  orderingClosedReason: string | null;
  isHost?: boolean;
  joinCode?: string;
}

interface PartyConfig {
  taxRate: number;
  nmi: { configured: boolean; tokenizationKey: string | null; environment: string };
}

export default function OfficePartyJoin({
  menu,
  partyId,
}: {
  menu: MenuData;
  partyId: string;
}) {
  const searchParams = useSearchParams();
  const hostToken = searchParams.get('host') || '';

  const [party, setParty] = useState<PartyView | null>(null);
  const [loadError, setLoadError] = useState('');
  const [config, setConfig] = useState<PartyConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);

  const { cart, addLine, setQuantity, clear } = useCart();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState<{ total: number; charged: boolean } | null>(null);

  const statusRef = useRef<HTMLDivElement | null>(null);

  const loadParty = useCallback(async () => {
    const query = hostToken ? `?hostToken=${encodeURIComponent(hostToken)}` : '';
    const response = await fetch(`/api/office-party/${partyId}${query}`, { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'That office party could not be found.');
    }
    setParty(data as PartyView);
  }, [partyId, hostToken]);

  useEffect(() => {
    let cancelled = false;
    loadParty().catch((err: unknown) => {
      if (!cancelled) {
        setLoadError(
          err instanceof Error ? err.message : 'That office party could not be found.'
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loadParty]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/public/office-party-config`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch(() => {
        if (!cancelled) setConfigFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Totals for the order being built ──────────────────────────────────────
  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);
  const tax = useMemo(
    () => Number((subtotal * (config?.taxRate ?? 0)).toFixed(2)),
    [subtotal, config]
  );
  const total = Number((subtotal + tax).toFixed(2));

  const needsCard = party?.billingMode === 'individual';
  const detailsComplete =
    guestName.trim() !== '' && (!needsCard || EMAIL_REGEX.test(guestEmail.trim()));
  const readyToSubmit = cart.length > 0 && detailsComplete;

  const submitOrder = useCallback(
    async (nmiPaymentToken?: string) => {
      setSubmitting(true);
      setError('');
      try {
        const response = await fetch(`/api/office-party/${partyId}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName,
            guestEmail,
            items: cartToItems(cart),
            ...(nmiPaymentToken ? { nmiPaymentToken } : {}),
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.details || data?.error || 'Failed to add your order.');
        }
        setPlaced({
          total: data.total,
          charged: data.paymentStatus === 'paid',
        });
        clear();
        setGuestName('');
        setGuestEmail('');
        if (data.party) setParty((current) => ({ ...(current as PartyView), ...data.party }));
        else await loadParty().catch(() => {});
      } catch (submitError: unknown) {
        setError(
          submitError instanceof Error ? submitError.message : 'Failed to add your order.'
        );
      } finally {
        setSubmitting(false);
        setTimeout(
          () => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          100
        );
      }
    },
    [partyId, guestName, guestEmail, cart, clear, loadParty]
  );

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-primary">We could not find that party</h2>
        <p className="mt-4 text-dark/70">{loadError}</p>
        <p className="mt-6 text-sm text-dark/60">
          Double-check the link, or call{' '}
          <a href="tel:+18124999866" className="font-semibold text-primary underline">
            (812) 499-9866
          </a>
          .
        </p>
      </div>
    );
  }

  if (!party) {
    return <p className="py-24 text-center text-dark/50">Loading the party…</p>;
  }

  const minimumLabel = money(party.minSubtotalCents / 100);
  const paymentUnavailable = configFailed || (config !== null && !config.nmi.configured);
  const closed = !party.orderingOpen;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <PartyHeader party={party} />

      <ProgressPanel party={party} minimumLabel={minimumLabel} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Left: pick your items ──────────────────────────────────────── */}
        <div className="space-y-10">
          {closed ? (
            <section className="rounded-2xl border border-dark/10 bg-light-cream p-6">
              <h2 className="font-serif text-2xl text-primary">Ordering is closed</h2>
              <p className="mt-2 text-dark/70">
                {party.orderingClosedReason ||
                  'This party is no longer taking orders.'}
              </p>
            </section>
          ) : (
            <section>
              <h2 className="font-serif text-2xl text-primary">Add your order</h2>
              <p className="mt-1 text-sm text-dark/60">
                Pick whatever you want off the menu — there is no minimum on your own
                order, only on the party as a whole.
              </p>
              <MenuPicker menu={menu} onAdd={addLine} />
            </section>
          )}

          <GuestList party={party} />
        </div>

        {/* ── Right: your order + payment ────────────────────────────────── */}
        {!closed && (
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-dark/10 bg-light-cream p-6">
              <h2 className="font-serif text-xl text-primary">Your order</h2>

              <CartLines cart={cart} onQuantity={setQuantity} />

              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-dark/70">Subtotal</dt>
                  <dd className="font-semibold text-dark">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dark/70">Tax</dt>
                  <dd className="font-semibold text-dark">{config ? money(tax) : '—'}</dd>
                </div>
                <div className="flex justify-between border-t border-dark/10 pt-2 text-base">
                  <dt className="font-bold text-primary">Your total</dt>
                  <dd className="font-bold text-primary">{config ? money(total) : '—'}</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-4 border-t border-dark/10 pt-6">
                <Field
                  id="op-guest-name"
                  label="Your name"
                  value={guestName}
                  onChange={setGuestName}
                  hint="So we know whose order is whose."
                />
                <Field
                  id="op-guest-email"
                  label={needsCard ? 'Your email' : 'Your email (optional)'}
                  type="email"
                  value={guestEmail}
                  onChange={setGuestEmail}
                  hint={needsCard ? 'For your receipt.' : 'We will email you a copy.'}
                />
              </div>

              {/* ── Payment ─────────────────────────────────────────────── */}
              <div className="mt-6 border-t border-dark/10 pt-6">
                {party.billingMode === 'host' ? (
                  <>
                    <h3 className="font-serif text-lg text-primary">No payment needed</h3>
                    <p className="mt-2 text-sm text-dark/70">
                      {party.businessName} is covering this party. Just add what you want.
                    </p>
                    <button
                      type="button"
                      disabled={!readyToSubmit || submitting}
                      onClick={() => submitOrder()}
                      className="mt-4 min-h-[52px] w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-bold text-cream transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? 'Adding…' : 'Add my order'}
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-lg text-primary">Payment</h3>
                    {paymentUnavailable ? (
                      <p className="mt-3 rounded-lg border border-dugout-red/25 bg-dugout-red/5 p-4 text-sm text-dark/75">
                        Online payment is temporarily unavailable. Please call{' '}
                        <a
                          href="tel:+18124999866"
                          className="font-semibold text-primary underline"
                        >
                          (812) 499-9866
                        </a>{' '}
                        to be added to this party.
                      </p>
                    ) : !config ? (
                      <p className="mt-3 text-sm text-dark/50">Loading payment…</p>
                    ) : (
                      <div className="mt-3">
                        {!readyToSubmit && (
                          <p className="mb-3 text-xs text-dark/60">
                            Add at least one item and fill in your name and email to pay.
                          </p>
                        )}
                        <NmiPaymentForm
                          tokenizationKey={config.nmi.tokenizationKey || ''}
                          environment={
                            config.nmi.environment === 'sandbox' ? 'sandbox' : 'production'
                          }
                          amount={total.toFixed(2)}
                          action={party.minimumMet ? 'Pay' : 'Hold'}
                          note={
                            party.minimumMet
                              ? 'This party has already met its minimum, so your card is charged now.'
                              : `We place a hold, not a charge — your card is only billed once the party reaches ${minimumLabel}. Holds last about ${AUTH_HOLD_DAYS} days.`
                          }
                          onTokenized={submitOrder}
                          onError={setError}
                          processing={submitting}
                          disabled={!readyToSubmit}
                        />
                      </div>
                    )}
                  </>
                )}

                <div ref={statusRef}>
                  {error && (
                    <p className="mt-4 rounded-lg border border-dugout-red/30 bg-dugout-red/5 p-3 text-sm text-dugout-red">
                      {error}
                    </p>
                  )}
                  {placed && (
                    <p className="mt-4 rounded-lg border border-field/40 bg-field/10 p-3 text-sm text-dark">
                      <strong>You are in!</strong> Your {money(placed.total)} order was added.{' '}
                      {party.billingMode === 'host'
                        ? `${party.businessName} is picking up the tab.`
                        : placed.charged
                        ? 'Your card has been charged.'
                        : `We have only placed a hold — you are charged when the party reaches ${minimumLabel}.`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {party.isHost && party.billingMode === 'host' && (
              <HostSettlePanel
                party={party}
                config={config}
                hostToken={hostToken}
                minimumLabel={minimumLabel}
                onSettled={loadParty}
              />
            )}
          </aside>
        )}
      </div>

      {closed && party.isHost && party.billingMode === 'host' && (
        <div className="mt-10 max-w-md">
          <HostSettlePanel
            party={party}
            config={config}
            hostToken={hostToken}
            minimumLabel={minimumLabel}
            onSettled={loadParty}
          />
        </div>
      )}
    </div>
  );
}

/** Where and when, plus who set it up. */
function PartyHeader({ party }: { party: PartyView }) {
  return (
    <header className="rounded-2xl border border-gold/40 bg-cream p-6 sm:p-8">
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-dugout-red">Office party</p>
      <h1 className="mt-2 font-serif text-3xl text-primary sm:text-4xl">
        {party.businessName}
      </h1>
      <p className="mt-3 text-lg text-dark/80">
        {formatDateKey(party.eventDateKey)} at{' '}
        <strong>{SLOT_LABELS[party.eventTime] || party.eventTime}</strong>
      </p>
      <p className="mt-1 text-dark/65">
        {party.businessAddress}
        {party.buildingLocation && (
          <>
            {' · '}
            <span className="font-medium text-dark/80">{party.buildingLocation}</span>
          </>
        )}
      </p>
      <p className="mt-3 text-sm text-dark/60">
        Hosted by {party.hostName} · Confirmation {party.reservationNumber}
      </p>
      {party.specialRequests && (
        <p className="mt-3 rounded-lg bg-white/70 p-3 text-sm text-dark/70">
          <strong>Note from {party.hostName}:</strong> {party.specialRequests}
        </p>
      )}
    </header>
  );
}

/** The bar toward the minimum — the thing everyone on the link is watching. */
function ProgressPanel({ party, minimumLabel }: { party: PartyView; minimumLabel: string }) {
  const minimum = party.minSubtotalCents / 100;
  const pct = Math.min(100, Math.round((party.subtotal / minimum) * 100));
  const confirmed = party.status === 'confirmed';

  return (
    <section className="mt-6 rounded-2xl border border-dark/10 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-2xl text-primary">
          {money(party.subtotal)}{' '}
          <span className="text-base font-normal text-dark/55">of {minimumLabel}</span>
        </p>
        <p className="text-sm text-dark/60">
          {party.guestCount} {party.guestCount === 1 ? 'order' : 'orders'} so far
        </p>
      </div>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-dark/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress toward the ${minimumLabel} minimum`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            party.minimumMet ? 'bg-field' : 'bg-gold'
          }`}
          style={{ width: `${Math.max(pct, party.subtotal > 0 ? 4 : 0)}%` }}
        />
      </div>

      {confirmed ? (
        <p className="mt-3 font-semibold text-field">
          This party is confirmed — we will see you on{' '}
          {formatDateKey(party.eventDateKey)}.
        </p>
      ) : party.minimumMet ? (
        <p className="mt-3 font-semibold text-field">
          Minimum reached — this party is good to go.
        </p>
      ) : (
        <p className="mt-3 text-dark/70">
          <strong>{money(party.shortfall)} to go</strong> before this party can be
          delivered.{' '}
          {party.billingMode === 'individual'
            ? 'Nobody is charged until it gets there.'
            : `${party.businessName} pays once it gets there.`}
        </p>
      )}
    </section>
  );
}

/** Who has ordered what so far. */
function GuestList({ party }: { party: PartyView }) {
  if (party.guests.length === 0) {
    return (
      <section>
        <h2 className="font-serif text-2xl text-primary">Nobody has ordered yet</h2>
        <p className="mt-1 text-sm text-dark/60">Be the first — the party needs you.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-serif text-2xl text-primary">
        On the party so far ({party.guests.length})
      </h2>
      <ul className="mt-4 divide-y divide-dark/10 rounded-xl border border-dark/10 bg-white">
        {party.guests.map((guest) => (
          <li key={guest.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-semibold text-dark">{guest.guestName}</p>
              <p className="mt-0.5 text-sm text-dark/60">
                {guest.items
                  .map(
                    (item) =>
                      `${item.quantity}× ${item.name}` +
                      (item.modifiers.length ? ` (${item.modifiers.join(', ')})` : '')
                  )
                  .join(' · ')}
              </p>
            </div>
            <span className="shrink-0 font-semibold text-primary">{money(guest.total)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Host-only: pay for the whole party in one charge. */
function HostSettlePanel({
  party,
  config,
  hostToken,
  minimumLabel,
  onSettled,
}: {
  party: PartyView;
  config: PartyConfig | null;
  hostToken: string;
  minimumLabel: string;
  onSettled: () => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const settle = useCallback(
    async (nmiPaymentToken: string) => {
      setSubmitting(true);
      setError('');
      try {
        const response = await fetch(`/api/office-party/${party.id}/settle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostToken, nmiPaymentToken }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.details || data?.error || 'Failed to pay for the party.');
        }
        setDone(true);
        await onSettled().catch(() => {});
      } catch (settleError: unknown) {
        setError(
          settleError instanceof Error ? settleError.message : 'Failed to pay for the party.'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [party.id, hostToken, onSettled]
  );

  if (done || party.paymentStatus === 'paid') {
    return (
      <div className="mt-6 rounded-2xl border border-field/40 bg-field/5 p-6">
        <h3 className="font-serif text-lg text-primary">Paid in full</h3>
        <p className="mt-2 text-sm text-dark/70">
          {money(party.total)} charged. Your party is confirmed — there is nothing to pay
          on delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-gold/50 bg-gold/5 p-6">
      <h3 className="font-serif text-lg text-primary">Pay for the party</h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-dugout-red">Host only</p>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-dark/70">Subtotal ({party.guestCount} orders)</dt>
          <dd className="font-semibold text-dark">{money(party.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-dark/70">Tax</dt>
          <dd className="font-semibold text-dark">{money(party.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-dark/10 pt-2 text-base">
          <dt className="font-bold text-primary">Total</dt>
          <dd className="font-bold text-primary">{money(party.total)}</dd>
        </div>
      </dl>

      {!party.minimumMet ? (
        <p className="mt-4 rounded-lg bg-white/70 p-3 text-sm text-dark/70">
          Once the party reaches the {minimumLabel} minimum you can pay here.{' '}
          <strong>{money(party.shortfall)} to go.</strong>
        </p>
      ) : !config || !config.nmi.configured ? (
        <p className="mt-4 rounded-lg border border-dugout-red/25 bg-dugout-red/5 p-3 text-sm text-dark/75">
          Online payment is temporarily unavailable. Please call{' '}
          <a href="tel:+18124999866" className="font-semibold text-primary underline">
            (812) 499-9866
          </a>{' '}
          to pay for your party.
        </p>
      ) : (
        <div className="mt-4">
          <NmiPaymentForm
            tokenizationKey={config.nmi.tokenizationKey || ''}
            environment={config.nmi.environment === 'sandbox' ? 'sandbox' : 'production'}
            amount={party.total.toFixed(2)}
            action="Pay"
            note="This charges the whole party at once and closes it to new orders."
            onTokenized={settle}
            onError={setError}
            processing={submitting}
          />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-dugout-red/30 bg-dugout-red/5 p-3 text-sm text-dugout-red">
          {error}
        </p>
      )}
    </div>
  );
}
