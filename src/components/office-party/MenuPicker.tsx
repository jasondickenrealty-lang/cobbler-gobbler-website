'use client';

/**
 * Menu picker and cart for office party ordering.
 *
 * Extracted from the old single-payer booking form so the host page and the
 * guest join page build an order the same way. Everything here is display and
 * cart bookkeeping only — the server re-prices every line before it takes a
 * card, so nothing computed in this file is trusted.
 */

import { useCallback, useMemo, useState } from 'react';
import type { MenuData, MenuItem, Modifier, ModifierCategory } from '@/lib/menu-data';
import { getModifierRule, missingCount, describeModifierRule } from '@/lib/modifierRules';

export interface CartLine {
  lineId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  modifiers: { id: string; name: string; price: number }[];
  specialInstructions: string;
}

export const money = (value: number) => `$${value.toFixed(2)}`;

export function lineTotal(line: CartLine): number {
  const unit = line.basePrice + line.modifiers.reduce((sum, mod) => sum + mod.price, 0);
  return unit * line.quantity;
}

export function cartSubtotal(cart: CartLine[]): number {
  return Number(cart.reduce((sum, line) => sum + lineTotal(line), 0).toFixed(2));
}

/** Shape the cart into the wire format the API expects. */
export function cartToItems(cart: CartLine[]) {
  return cart.map((line) => ({
    menuItemId: line.menuItemId,
    quantity: line.quantity,
    modifiers: line.modifiers.map((mod) => ({ id: mod.id })),
    specialInstructions: line.specialInstructions,
  }));
}

/** Cart state plus the add/adjust operations both pages need. */
export function useCart() {
  const [cart, setCart] = useState<CartLine[]>([]);

  const addLine = useCallback(
    (item: MenuItem, modifiers: CartLine['modifiers'], instructions: string) => {
      setCart((current) => {
        const signature = modifiers.map((mod) => mod.id).sort().join('|');
        // An identical line stacks rather than repeating in the summary.
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

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((current) =>
      quantity < 1
        ? current.filter((line) => line.lineId !== lineId)
        : current.map((line) =>
            line.lineId === lineId ? { ...line, quantity: Math.min(200, quantity) } : line
          )
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  return { cart, addLine, setQuantity, clear };
}

/**
 * The menu, grouped by category. Items with option groups open the customizer
 * first; everything else drops straight into the cart.
 */
export function MenuPicker({
  menu,
  onAdd,
}: {
  menu: MenuData;
  onAdd: (item: MenuItem, modifiers: CartLine['modifiers'], instructions: string) => void;
}) {
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);

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

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (groupsForItem(item).length > 0) {
        setCustomizing(item);
        return;
      }
      onAdd(item, [], '');
    },
    [groupsForItem, onAdd]
  );

  if (!menu.ok || menu.items.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-dark/10 bg-light-cream p-5 text-dark/70">
        Our menu is not loading right now. Please call{' '}
        <a href="tel:+18124999866" className="font-semibold text-primary underline">
          (812) 499-9866
        </a>{' '}
        and we will sort your order out over the phone.
      </p>
    );
  }

  return (
    <>
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

      {customizing && (
        <ItemCustomizer
          item={customizing}
          groups={groupsForItem(customizing)}
          modifiersByCategory={modifiersByCategory}
          onCancel={() => setCustomizing(null)}
          onAdd={(modifiers, instructions) => {
            onAdd(customizing, modifiers, instructions);
            setCustomizing(null);
          }}
        />
      )}
    </>
  );
}

/** The running order, with quantity steppers. */
export function CartLines({
  cart,
  onQuantity,
  emptyLabel = 'Nothing added yet.',
}: {
  cart: CartLine[];
  onQuantity: (lineId: string, quantity: number) => void;
  emptyLabel?: string;
}) {
  if (cart.length === 0) {
    return <p className="mt-4 text-sm text-dark/60">{emptyLabel}</p>;
  }

  return (
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
                <p className="text-xs italic text-dark/55">{line.specialInstructions}</p>
              )}
            </div>
            <span className="shrink-0 font-semibold text-primary">{money(lineTotal(line))}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label={`Decrease ${line.name}`}
              onClick={() => onQuantity(line.lineId, line.quantity - 1)}
              className="h-9 w-9 rounded-lg border border-dark/15 bg-white text-lg leading-none text-dark"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
            <button
              type="button"
              aria-label={`Increase ${line.name}`}
              onClick={() => onQuantity(line.lineId, line.quantity + 1)}
              className="h-9 w-9 rounded-lg border border-dark/15 bg-white text-lg leading-none text-dark"
            >
              +
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Labelled text input. 16px text so iOS doesn't zoom on focus. */
export function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  hint,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[48px] w-full rounded-lg border border-dark/15 bg-white px-3 py-3 text-base text-dark"
      />
      {hint && <p className="mt-1 text-xs text-dark/50">{hint}</p>}
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
            {item.description && <p className="mt-1 text-sm text-dark/60">{item.description}</p>}
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
            <label htmlFor="op-item-note" className="mb-1 block text-sm font-medium text-dark/70">
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
