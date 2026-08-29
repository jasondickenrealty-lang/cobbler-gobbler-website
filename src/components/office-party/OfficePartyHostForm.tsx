'use client';

/**
 * Host setup for an office party.
 *
 * This form does not build an order and never asks for a card. It reserves the
 * delivery slot, records where in the building the ice cream goes, and decides
 * who pays. What comes back is a share link the host sends around the office;
 * the actual ordering happens on /office-party/[id].
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MIN_SUBTOTAL_CENTS,
  LEAD_TIME_MINUTES,
  MAX_DAYS_AHEAD,
  SLOT_LABELS,
  availableSlotsFor,
  centralDateKey,
  addDays,
  formatDateKey,
  type BillingMode,
} from '@/lib/partySlots';
import { Field } from './MenuPicker';

const INITIAL_DETAILS = {
  businessName: '',
  businessAddress: '',
  buildingLocation: '',
  businessPhone: '',
  contactName: '',
  contactPhone: '',
  email: '',
  specialRequests: '',
};

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreatedParty {
  id: string;
  reservationNumber: string;
  joinCode: string;
  joinUrl: string;
  hostUrl: string;
  billingMode: BillingMode;
  pickupDate: string;
  pickupTime: string;
}

export default function OfficePartyHostForm() {
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [billingMode, setBillingMode] = useState<BillingMode | ''>('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedParty | null>(null);

  const statusRef = useRef<HTMLDivElement | null>(null);

  // "Now" is captured once on mount so slot availability doesn't shift mid-form.
  const [now] = useState(() => new Date());
  const todayKey = useMemo(() => centralDateKey(now), [now]);

  const slotsForDate = useMemo(
    () => (pickupDate ? availableSlotsFor(pickupDate, now) : []),
    [pickupDate, now]
  );

  // Drop a chosen slot that stops being valid when the date changes.
  useEffect(() => {
    if (pickupTime && !slotsForDate.includes(pickupTime)) setPickupTime('');
  }, [slotsForDate, pickupTime]);

  const detailsComplete =
    details.businessName.trim() !== '' &&
    details.businessAddress.trim() !== '' &&
    details.buildingLocation.trim() !== '' &&
    US_PHONE_REGEX.test(details.businessPhone.trim()) &&
    details.contactName.trim() !== '' &&
    US_PHONE_REGEX.test(details.contactPhone.trim()) &&
    EMAIL_REGEX.test(details.email.trim());

  const readyToCreate =
    detailsComplete && Boolean(pickupDate) && Boolean(pickupTime) && Boolean(billingMode);

  const handleCreate = async () => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/office-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, billingMode, pickupDate, pickupTime }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to set up your office party.');
      }
      setCreated(data as CreatedParty);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to set up your office party.'
      );
      setTimeout(
        () => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        100
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return <ShareScreen party={created} />;
  }

  const minimumLabel = `$${(MIN_SUBTOTAL_CENTS / 100).toFixed(0)}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-10">
        {/* ── Delivery ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-2xl text-primary">1. When should we deliver?</h2>
          <p className="mt-1 text-sm text-dark/60">
            Deliveries are at 11:00 AM, 12:00 PM, or 1:00 PM. Book anywhere from today —
            with at least {LEAD_TIME_MINUTES} minutes notice — to {MAX_DAYS_AHEAD} days out.
          </p>

          <div className="mt-5 max-w-xs">
            <label htmlFor="op-date" className="mb-1 block text-sm font-medium text-dark/70">
              Delivery date
            </label>
            <input
              id="op-date"
              type="date"
              value={pickupDate}
              min={todayKey}
              max={addDays(todayKey, MAX_DAYS_AHEAD)}
              onChange={(event) => setPickupDate(event.target.value)}
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-3 text-base text-dark"
            />
          </div>

          {pickupDate && (
            <div className="mt-5">
              <span className="mb-2 block text-sm font-medium text-dark/70">Delivery time</span>
              {slotsForDate.length === 0 ? (
                <p className="rounded-lg border border-dugout-red/25 bg-dugout-red/5 p-4 text-sm text-dark/70">
                  No delivery times are left for {formatDateKey(pickupDate)}. Please choose
                  another day.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {slotsForDate.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupTime(slot)}
                      className={`min-h-[48px] rounded-xl border px-6 py-3 font-semibold transition-colors ${
                        pickupTime === slot
                          ? 'border-primary bg-primary text-cream'
                          : 'border-dark/15 bg-white text-dark hover:border-gold'
                      }`}
                    >
                      {SLOT_LABELS[slot] || slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Where ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-2xl text-primary">2. Where are we going?</h2>
          <p className="mt-1 text-sm text-dark/60">
            Tell us the building and exactly where inside it to bring everything.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              id="op-business"
              label="Company name"
              value={details.businessName}
              onChange={(value) => setDetails({ ...details, businessName: value })}
            />
            <Field
              id="op-business-phone"
              label="Company phone"
              type="tel"
              value={details.businessPhone}
              onChange={(value) => setDetails({ ...details, businessPhone: value })}
            />
            <div className="sm:col-span-2">
              <Field
                id="op-business-address"
                label="Street address"
                value={details.businessAddress}
                onChange={(value) => setDetails({ ...details, businessAddress: value })}
                placeholder="900 Main Street, Evansville, IN 47708"
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                id="op-building-location"
                label="Where in the building"
                value={details.buildingLocation}
                onChange={(value) => setDetails({ ...details, buildingLocation: value })}
                placeholder="Suite 300 — 3rd floor break room"
                hint="Floor, suite, room — whatever gets our driver to the right door."
              />
            </div>
          </div>
        </section>

        {/* ── Who ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-2xl text-primary">3. Who is hosting?</h2>
          <p className="mt-1 text-sm text-dark/60">
            You will get the share link and the running order list.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              id="op-contact"
              label="Your name"
              value={details.contactName}
              onChange={(value) => setDetails({ ...details, contactName: value })}
            />
            <Field
              id="op-contact-phone"
              label="Your phone"
              type="tel"
              value={details.contactPhone}
              onChange={(value) => setDetails({ ...details, contactPhone: value })}
            />
            <div className="sm:col-span-2">
              <Field
                id="op-email"
                label="Your email"
                type="email"
                value={details.email}
                onChange={(value) => setDetails({ ...details, email: value })}
                hint="We email you the share link and your private host link."
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="op-requests" className="mb-1 block text-sm font-medium text-dark/70">
                Special requests <span className="text-dark/40">(optional)</span>
              </label>
              <textarea
                id="op-requests"
                rows={3}
                value={details.specialRequests}
                onChange={(event) =>
                  setDetails({ ...details, specialRequests: event.target.value })
                }
                className="w-full rounded-lg border border-dark/15 bg-white px-3 py-3 text-base text-dark"
                placeholder="Allergies, serving notes, parking or check-in instructions."
              />
            </div>
          </div>
        </section>

        {/* ── Who pays ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-2xl text-primary">4. Who is paying?</h2>
          <p className="mt-1 text-sm text-dark/60">
            Either way the party needs {minimumLabel} of orders before tax to go ahead.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <BillingChoice
              selected={billingMode === 'individual'}
              onSelect={() => setBillingMode('individual')}
              title="Everyone pays for themselves"
              body={`Each person enters their own card. We only place a hold — nobody is charged until the party reaches ${minimumLabel}. If it never gets there, no one pays a cent.`}
            />
            <BillingChoice
              selected={billingMode === 'host'}
              onSelect={() => setBillingMode('host')}
              title="The company pays"
              body={`Your coworkers add what they want with no card at all. Once the party reaches ${minimumLabel}, you pay the whole tab in one go from your host link.`}
            />
          </div>
        </section>

        {/* ── Create ───────────────────────────────────────────────────── */}
        <div ref={statusRef}>
          {error && (
            <p className="mb-4 rounded-lg border border-dugout-red/30 bg-dugout-red/5 p-3 text-sm text-dugout-red">
              {error}
            </p>
          )}
          {!readyToCreate && (
            <p className="mb-3 text-sm text-dark/60">
              Fill in the delivery time, the address, your details, and who is paying to
              create the party.
            </p>
          )}
          <button
            type="button"
            disabled={!readyToCreate || submitting}
            onClick={handleCreate}
            className="min-h-[56px] w-full rounded-xl bg-primary px-6 py-4 text-lg font-bold text-cream transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Setting it up…' : 'Create the party & get my share link'}
          </button>
          <p className="mt-3 text-center text-xs text-dark/55">
            No payment now. Nothing is charged until the party reaches {minimumLabel}.
          </p>
        </div>
      </div>
    </div>
  );
}

/** One of the two billing options, as a big tappable card. */
function BillingChoice({
  selected,
  onSelect,
  title,
  body,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-xl border-2 p-5 text-left transition-colors ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-dark/15 bg-white hover:border-gold'
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-primary' : 'border-dark/25'
          }`}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </span>
        <span className="font-semibold text-dark">{title}</span>
      </span>
      <span className="mt-2 block text-sm leading-6 text-dark/65">{body}</span>
    </button>
  );
}

/** What the host sees once the party exists: the links to hand around. */
function ShareScreen({ party }: { party: CreatedParty }) {
  const [copied, setCopied] = useState<'join' | 'host' | null>(null);

  const copy = async (value: string, which: 'join' | 'host') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard is blocked in some embedded browsers; the link is on screen
      // and selectable either way, so this is not worth an error message.
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-field/30 bg-field/5 p-8">
        <h2 className="text-center font-serif text-3xl text-primary">Your party is set up</h2>
        <p className="mt-4 text-center text-lg text-dark/80">
          {formatDateKey(party.pickupDate)} at{' '}
          <strong>{SLOT_LABELS[party.pickupTime] || party.pickupTime}</strong>
        </p>
        <p className="mt-2 text-center text-dark/70">
          Confirmation <strong>{party.reservationNumber}</strong>
        </p>

        <div className="mt-8 rounded-xl border border-dark/10 bg-white p-5">
          <h3 className="font-serif text-lg text-primary">Send this to the office</h3>
          <p className="mt-1 text-sm text-dark/60">
            Anyone with this link can add their own order.
          </p>
          <p className="mt-3 break-all rounded-lg bg-light-cream p-3 text-sm text-dark">
            {party.joinUrl}
          </p>
          <button
            type="button"
            onClick={() => copy(party.joinUrl, 'join')}
            className="mt-3 min-h-[48px] w-full rounded-xl bg-primary px-6 py-3 font-bold text-cream"
          >
            {copied === 'join' ? 'Copied!' : 'Copy share link'}
          </button>
          <p className="mt-3 text-center text-sm text-dark/60">
            Join code: <strong className="tracking-widest text-dark">{party.joinCode}</strong>
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-gold/40 bg-gold/5 p-5">
          <h3 className="font-serif text-lg text-primary">Your host link — keep this one</h3>
          <p className="mt-1 text-sm text-dark/60">
            Shows every order as it comes in
            {party.billingMode === 'host' ? ', and is where you pay for the party' : ''}.
            We emailed it to you too.
          </p>
          <p className="mt-3 break-all rounded-lg bg-white p-3 text-sm text-dark">
            {party.hostUrl}
          </p>
          <button
            type="button"
            onClick={() => copy(party.hostUrl, 'host')}
            className="mt-3 min-h-[48px] w-full rounded-xl border-2 border-primary px-6 py-3 font-bold text-primary"
          >
            {copied === 'host' ? 'Copied!' : 'Copy host link'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-dark/60">
          Need to change or cancel? Call{' '}
          <a href="tel:+18124999866" className="font-semibold text-primary underline">
            (812) 499-9866
          </a>
          .
        </p>
      </div>
    </div>
  );
}
