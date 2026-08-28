'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MenuData, MenuItem, Modifier, ModifierCategory } from '@/lib/menu-data';
import { getModifierRule, missingCount, describeModifierRule } from '@/lib/modifierRules';
import {
  MIN_SUBTOTAL_CENTS,
  LEAD_TIME_MINUTES,
  MAX_DAYS_AHEAD,
  SLOT_LABELS,
  availableSlotsFor,
  centralDateKey,
  addDays,
  formatDateKey,
} from '@/lib/partySlots';
import NmiPaymentForm from './NmiPaymentForm';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/+$/, '');

interface CartLine {
  lineId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  modifiers: { id: string; name: string; price: number }[];
  specialInstructions: string;
}

interface PartyConfig {
  taxRate: number;
  minSubtotalCents: number;
  nmi: { configured: boolean; tokenizationKey: string | null; environment: string };
}

const INITIAL_DETAILS = {
  businessName: '',
  businessAddress: '',
  businessPhone: '',
  contactName: '',
  contactPhone: '',
  email: '',
  specialRequests: '',
};

const US_PHONE_REGEX = /^\+?1?\s*\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const money = (value: number) => `$${value.toFixed(2)}`;

function lineTotal(line: CartLine): number {
  const unit = line.basePrice + line.modifiers.reduce((sum, mod) => sum + mod.price, 0);
  return unit * line.quantity;
}

export default function OfficePartyBooking({ menu }: { menu: MenuData }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [config, setConfig] = useState<PartyConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    reservationNumber: string;
    total: number;
    pickupDate: string;
    pickupTime: string;
  } | null>(null);

  const statusRef = useRef<HTMLDivElement | null>(null);

  // "Now" is captured once on mount so slot availability doesn't shift mid-form.
  const [now] = useState(() => new Date());
  const todayKey = useMemo(() => centralDateKey(now), [now]);

  // ── Config (tax rate + NMI key) ───────────────────────────────────────────
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

  // ── Menu grouping ─────────────────────────────────────────────────────────
  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();
    for (const item of menu.items) {
      if (!grouped.has(item.category)) grouped.set(item.category, []);
      grouped.get(item.category)!.push(item);
    }
    return grouped;
  }, [menu.items]);

  const modifierCategoryById = useMemo(() => {
    const map = new Map<string, ModifierCategory>();
    for (const category of menu.modifierCategories) map.set(category.id, category);
    return map;
  }, [menu.modifierCategories]);

  const modifiersByCategory = useMemo(() => {
    const map = new Map<string, Modifier[]>();
    for (const modifier of menu.modifiers) {
      if (!map.has(modifier.modifierCategoryId)) map.set(modifier.modifierCategoryId, []);
      map.get(modifier.modifierCategoryId)!.push(modifier);
    }
    return map;
  }, [menu.modifiers]);

  const groupsForItem = useCallback(
    (item: MenuItem) =>
      (item.modifierCategoryIds || [])
        .map((id) => modifierCategoryById.get(id))
        .filter((group): group is ModifierCategory => Boolean(group))
        .filter((group) => (modifiersByCategory.get(group.id) || []).length > 0),
    [modifierCategoryById, modifiersByCategory]
  );

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = useMemo(
    () => Number(cart.reduce((sum, line) => sum + lineTotal(line), 0).toFixed(2)),
    [cart]
  );
  const minimumCents = config?.minSubtotalCents ?? MIN_SUBTOTAL_CENTS;
  const meetsMinimum = Math.round(subtotal * 100) >= minimumCents;
  const shortfall = Math.max(0, minimumCents / 100 - subtotal);
  const tax = useMemo(
    () => Number((subtotal * (config?.taxRate ?? 0)).toFixed(2)),
    [subtotal, config]
  );
  const total = Number((subtotal + tax).toFixed(2));

  // ── Pickup slots ──────────────────────────────────────────────────────────
  const slotsForDate = useMemo(
    () => (pickupDate ? availableSlotsFor(pickupDate, now) : []),
    [pickupDate, now]
  );

  // Drop a chosen slot that stops being valid when the date changes.
  useEffect(() => {
    if (pickupTime && !slotsForDate.includes(pickupTime)) setPickupTime('');
  }, [slotsForDate, pickupTime]);

  // ── Cart operations ───────────────────────────────────────────────────────
  const addLine = useCallback(
    (item: MenuItem, modifiers: CartLine['modifiers'], instructions: string) => {
      setCart((current) => {
        const signature = modifiers.map((mod) => mod.id).sort().join('|');
        const existing = current.find(
          (line) =>
            line.menuItemId === item.id &&
            line.modifiers.map((mod) => mod.id).sort().join('|') === signature &&
            line.specialInstructions === instructions
        );
        if (existing) {
          return current.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: Math.min(200, line.quantity + 1) }
              : line
          );
        }
        return [
          ...current,
          {
            lineId: `${item.id}-${signature}-${current.length}-${instructions.length}`,
            menuItemId: item.id,
            name: item.name,
            basePrice: item.price,
            quantity: 1,
            modifiers,
            specialInstructions: instructions,
          },
        ];
      });
    },
    []
  );

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (groupsForItem(item).length > 0) {
        setCustomizing(item);
        return;
      }
      addLine(item, [], '');
    },
    [groupsForItem, addLine]
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((current) =>
      quantity < 1
        ? current.filter((line) => line.lineId !== lineId)
        : current.map((line) =>
            line.lineId === lineId ? { ...line, quantity: Math.min(200, quantity) } : line
          )
    );
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────
  const detailsComplete =
    details.businessName.trim() !== '' &&
    details.businessAddress.trim() !== '' &&
    US_PHONE_REGEX.test(details.businessPhone.trim()) &&
    details.contactName.trim() !== '' &&
    US_PHONE_REGEX.test(details.contactPhone.trim()) &&
    EMAIL_REGEX.test(details.email.trim());

  const readyToPay =
    cart.length > 0 && meetsMinimum && Boolean(pickupDate) && Boolean(pickupTime) && detailsComplete;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleTokenized = useCallback(
    async (nmiPaymentToken: string) => {
      setSubmitting(true);
      setError('');
      try {
        const response = await fetch('/api/office-party-reservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...details,
            pickupDate,
            pickupTime,
            nmiPaymentToken,
            items: cart.map((line) => ({
              menuItemId: line.menuItemId,
              quantity: line.quantity,
              modifiers: line.modifiers.map((mod) => ({ id: mod.id })),
              specialInstructions: line.specialInstructions,
            })),
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.details || data?.error || 'Failed to book your office party.');
        }
        setResult({
          reservationNumber: data.reservationNumber,
          total: data.total,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        });
        setCart([]);
        setDetails(INITIAL_DETAILS);
        setTimeout(
          () => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          100
        );
      } catch (submitError: any) {
        setError(submitError?.message || 'Failed to book your office party.');
        setTimeout(
          () => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          100
        );
      } finally {
        setSubmitting(false);
      }
    },
    [cart, details, pickupDate, pickupTime]
  );

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <div ref={statusRef} className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-field/30 bg-field/5 p-8 text-center">
          <h2 className="font-serif text-3xl text-primary">Your office party is booked</h2>
          <p className="mt-4 text-lg text-dark/80">
            {formatDateKey(result.pickupDate)} at{' '}
            <strong>{SLOT_LABELS[result.pickupTime] || result.pickupTime}</strong>
          </p>
          <p className="mt-2 text-dark/70">
            Confirmation <strong>{result.reservationNumber}</strong> · Paid{' '}
            <strong>{money(result.total)}</strong>
          </p>
          <p className="mt-6 text-dark/70">
            We emailed your receipt. Pick up at 900 Main Street, Evansville — there is nothing
            left to pay.
          </p>
          <p className="mt-4 text-sm text-dark/60">
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

  const paymentUnavailable = configFailed || (config !== null && !config.nmi.configured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Left: build the order ─────────────────────────────────────── */}
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl text-primary">1. Build your order</h2>
            <p className="mt-1 text-sm text-dark/60">
              Anything on the menu. {money(minimumCents / 100)} minimum before tax.
            </p>

            {!menu.ok || menu.items.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dark/10 bg-light-cream p-5 text-dark/70">
                Our menu is not loading right now. Please call{' '}
                <a href="tel:+18124999866" className="font-semibold text-primary underline">
                  (812) 499-9866
                </a>{' '}
                and we will set your party up over the phone.
              </p>
            ) : (
              <div className="mt-6 space-y-8">
                {Array.from(itemsByCategory.entries()).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-serif text-lg uppercase tracking-wide text-primary/80">
                      {category}
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {items.map((item) => {
                        const hasOptions = groupsForItem(item).length > 0;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemClick(item)}
                            className="flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-dark/10 bg-white p-4 text-left transition-colors hover:border-gold hover:bg-gold/5"
                          >
                            <span>
                              <span className="block font-semibold text-dark">{item.name}</span>
                              {item.description && (
                                <span className="mt-0.5 block text-xs text-dark/55">
                                  {item.description}
                                </span>
                              )}
                              {hasOptions && (
                                <span className="mt-1 block text-xs font-medium text-gold">
                                  Choose options
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 font-semibold text-primary">
                              {money(item.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Pickup ───────────────────────────────────────────────────── */}
          <section>
            <h2 className="font-serif text-2xl text-primary">2. Choose your pickup</h2>
            <p className="mt-1 text-sm text-dark/60">
              Pickups are at 11:00 AM, 12:00 PM, or 1:00 PM, and need at least{' '}
              {LEAD_TIME_MINUTES} minutes notice.
            </p>

            <div className="mt-5 max-w-xs">
              <label htmlFor="op-date" className="mb-1 block text-sm font-medium text-dark/70">
                Pickup date
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
                <span className="mb-2 block text-sm font-medium text-dark/70">Pickup time</span>
                {slotsForDate.length === 0 ? (
                  <p className="rounded-lg border border-dugout-red/25 bg-dugout-red/5 p-4 text-sm text-dark/70">
                    No pickup times are left for {formatDateKey(pickupDate)}. Please choose
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

          {/* ── Details ──────────────────────────────────────────────────── */}
          <section>
            <h2 className="font-serif text-2xl text-primary">3. Who is this for?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="op-business"
                label="Business name"
                value={details.businessName}
                onChange={(value) => setDetails({ ...details, businessName: value })}
              />
              <Field
                id="op-business-phone"
                label="Business phone"
                type="tel"
                value={details.businessPhone}
                onChange={(value) => setDetails({ ...details, businessPhone: value })}
              />
              <div className="sm:col-span-2">
                <Field
                  id="op-business-address"
                  label="Business address"
                  value={details.businessAddress}
                  onChange={(value) => setDetails({ ...details, businessAddress: value })}
                />
              </div>
              <Field
                id="op-contact"
                label="Point of contact"
                value={details.contactName}
                onChange={(value) => setDetails({ ...details, contactName: value })}
              />
              <Field
                id="op-contact-phone"
                label="Point of contact phone"
                type="tel"
                value={details.contactPhone}
                onChange={(value) => setDetails({ ...details, contactPhone: value })}
              />
              <div className="sm:col-span-2">
                <Field
                  id="op-email"
                  label="Email (for your receipt)"
                  type="email"
                  value={details.email}
                  onChange={(value) => setDetails({ ...details, email: value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="op-requests"
                  className="mb-1 block text-sm font-medium text-dark/70"
                >
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
                  placeholder="Allergies, serving notes, anything we should know."
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Right: summary + payment ──────────────────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-dark/10 bg-light-cream p-6">
            <h2 className="font-serif text-xl text-primary">Your order</h2>

            {cart.length === 0 ? (
              <p className="mt-4 text-sm text-dark/60">Nothing added yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cart.map((line) => (
                  <li key={line.lineId} className="border-b border-dark/10 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-dark">{line.name}</p>
                        {line.modifiers.length > 0 && (
                          <p className="text-xs text-dark/55">
                            {line.modifiers.map((mod) => mod.name).join(', ')}
                          </p>
                        )}
                        {line.specialInstructions && (
                          <p className="text-xs italic text-dark/55">
                            {line.specialInstructions}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-semibold text-primary">
                        {money(lineTotal(line))}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${line.name}`}
                        onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                        className="h-9 w-9 rounded-lg border border-dark/15 bg-white text-lg leading-none text-dark"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${line.name}`}
                        onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                        className="h-9 w-9 rounded-lg border border-dark/15 bg-white text-lg leading-none text-dark"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-dark/70">Subtotal</dt>
                <dd className="font-semibold text-dark">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark/70">Tax</dt>
                <dd className="font-semibold text-dark">
                  {config ? money(tax) : '—'}
                </dd>
              </div>
              <div className="flex justify-between border-t border-dark/10 pt-2 text-base">
                <dt className="font-bold text-primary">Total</dt>
                <dd className="font-bold text-primary">{config ? money(total) : '—'}</dd>
              </div>
            </dl>

            {!meetsMinimum && (
              <p className="mt-4 rounded-lg bg-gold/15 p-3 text-sm font-medium text-dark">
                Add {money(shortfall)} more to reach the {money(minimumCents / 100)} office
                party minimum.
              </p>
            )}

            {/* ── Payment ────────────────────────────────────────────────── */}
            <div className="mt-6 border-t border-dark/10 pt-6">
              <h3 className="font-serif text-lg text-primary">Payment</h3>

              {paymentUnavailable ? (
                <p className="mt-3 rounded-lg border border-dugout-red/25 bg-dugout-red/5 p-4 text-sm text-dark/75">
                  Online payment is temporarily unavailable. Please call{' '}
                  <a href="tel:+18124999866" className="font-semibold text-primary underline">
                    (812) 499-9866
                  </a>{' '}
                  and we will book your party over the phone.
                </p>
              ) : !config ? (
                <p className="mt-3 text-sm text-dark/50">Loading payment…</p>
              ) : (
                <div className="mt-3">
                  {!readyToPay && (
                    <p className="mb-3 text-xs text-dark/60">
                      Complete your order, pickup time, and contact details to pay.
                    </p>
                  )}
                  <NmiPaymentForm
                    tokenizationKey={config.nmi.tokenizationKey || ''}
                    environment={config.nmi.environment === 'sandbox' ? 'sandbox' : 'production'}
                    amount={total.toFixed(2)}
                    onTokenized={handleTokenized}
                    onError={setError}
                    processing={submitting}
                    disabled={!readyToPay}
                  />
                </div>
              )}

              <div ref={statusRef}>
                {error && (
                  <p className="mt-4 rounded-lg border border-dugout-red/30 bg-dugout-red/5 p-3 text-sm text-dugout-red">
                    {error}
                  </p>
                )}
              </div>

              <p className="mt-4 text-xs text-dark/55">
                Paid in full at booking. To change or cancel, call (812) 499-9866.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {customizing && (
        <ItemCustomizer
          item={customizing}
          groups={groupsForItem(customizing)}
          modifiersByCategory={modifiersByCategory}
          onCancel={() => setCustomizing(null)}
          onAdd={(modifiers, instructions) => {
            addLine(customizing, modifiers, instructions);
            setCustomizing(null);
          }}
        />
      )}
    </div>
  );
}

/** Labelled text input. 16px text so iOS doesn't zoom on focus. */
function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-dark/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[48px] w-full rounded-lg border border-dark/15 bg-white px-3 py-3 text-base text-dark"
      />
    </div>
  );
}

/**
 * Modifier picker. Enforces each group's min/max through getModifierRule, which
 * accepts both the singular and plural spellings the POS and older docs use.
 */
function ItemCustomizer({
  item,
  groups,
  modifiersByCategory,
  onCancel,
  onAdd,
}: {
  item: MenuItem;
  groups: ModifierCategory[];
  modifiersByCategory: Map<string, Modifier[]>;
  onCancel: () => void;
  onAdd: (modifiers: CartLine['modifiers'], instructions: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [instructions, setInstructions] = useState('');

  const toggle = (group: ModifierCategory, modifierId: string) => {
    const { max } = getModifierRule(group);
    setSelected((current) => {
      const chosen = current[group.id] || [];
      if (chosen.includes(modifierId)) {
        return { ...current, [group.id]: chosen.filter((id) => id !== modifierId) };
      }
      // A single-select group swaps rather than stacks.
      if (max === 1) return { ...current, [group.id]: [modifierId] };
      if (max > 0 && chosen.length >= max) return current;
      return { ...current, [group.id]: [...chosen, modifierId] };
    });
  };

  const unmet = groups.filter((group) => {
    const available = (modifiersByCategory.get(group.id) || []).length;
    return missingCount(group, (selected[group.id] || []).length, available) > 0;
  });

  const chosenModifiers = groups.flatMap((group) =>
    (selected[group.id] || []).map((id) => {
      const modifier = (modifiersByCategory.get(group.id) || []).find((mod) => mod.id === id);
      return { id, name: modifier?.name || '', price: modifier?.price || 0 };
    })
  );

  const preview = item.price + chosenModifiers.reduce((sum, mod) => sum + mod.price, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-dark/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${item.name}`}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl text-primary">{item.name}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-dark/60">{item.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="shrink-0 text-2xl leading-none text-dark/50"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {groups.map((group) => {
            const options = modifiersByCategory.get(group.id) || [];
            const chosen = selected[group.id] || [];
            return (
              <fieldset key={group.id}>
                <legend className="text-sm font-semibold text-dark">
                  {group.name}{' '}
                  <span className="font-normal text-dark/50">
                    · {describeModifierRule(group, options.length)}
                  </span>
                </legend>
                <div className="mt-2 space-y-2">
                  {options.map((modifier) => (
                    <label
                      key={modifier.id}
                      className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-lg border border-dark/10 bg-light-cream px-3 py-2"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={chosen.includes(modifier.id)}
                          onChange={() => toggle(group, modifier.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-dark">{modifier.name}</span>
                      </span>
                      {modifier.price > 0 && (
                        <span className="text-sm text-dark/60">+{money(modifier.price)}</span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}

          <div>
            <label
              htmlFor="op-item-note"
              className="mb-1 block text-sm font-medium text-dark/70"
            >
              Notes for this item <span className="text-dark/40">(optional)</span>
            </label>
            <input
              id="op-item-note"
              type="text"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-dark/15 px-3 py-2 text-base"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={unmet.length > 0}
          onClick={() => onAdd(chosenModifiers, instructions.trim())}
          className="mt-6 min-h-[52px] w-full rounded-xl bg-primary px-6 py-3 font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
        >
          {unmet.length > 0
            ? `Choose ${unmet[0].name} to continue`
            : `Add to order · ${money(preview)}`}
        </button>
      </div>
    </div>
  );
}
