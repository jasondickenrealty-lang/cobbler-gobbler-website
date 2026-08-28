/**
 * Server-side menu loader — the source of truth is the same public API the TV
 * menu boards and the online-ordering app read (`/api/v1/menu` and
 * `/api/v1/modifiers`), which serves the POS `categories`, `menuItems`,
 * `modifierCategories` and `modifiers` collections through the Admin SDK.
 *
 * This used to read those collections directly with the Firestore client SDK.
 * They are root-level collections and the security rules end in a default-deny,
 * so an unauthenticated server render always came back empty and the menu page
 * silently fell back to "download the PDF" instead of listing the menu.
 *
 * Runs on the server so the full menu is rendered into the HTML response and is
 * fully crawlable by Google — no client-side "Loading…" state required.
 *
 * Everything is wrapped in try/catch so a menu fetch failure degrades to a
 * graceful fallback instead of breaking the build or the page.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/$/, '');

const REVALIDATE_SECONDS = 600;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
  displayOrder?: number;
  categoryOrder?: number;
  /** Modifier groups this item offers. Used by the office party builder. */
  modifierCategoryIds?: string[];
}

/** A menu category as shown on the page — name plus its optional blurb. */
export interface MenuCategory {
  name: string;
  description: string;
}

export interface ModifierCategory {
  id: string;
  name: string;
  displayOrder?: number;
  /**
   * Selection rules. The POS Settings screen saves the singular spellings;
   * older docs use the plural. Both are carried through so getModifierRule()
   * can accept either — see lib/modifierRules.ts.
   */
  minSelection?: number;
  maxSelection?: number;
  minSelections?: number;
  maxSelections?: number;
  isRequired?: boolean;
  required?: boolean;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  modifierCategoryId: string;
  isActive?: boolean;
}

export interface MenuData {
  ok: boolean;
  items: MenuItem[];
  categories: MenuCategory[];
  modifierCategories: ModifierCategory[];
  modifiers: Modifier[];
}

export function categoryAnchorId(category: string): string {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `category-${slug}`;
}

const EMPTY: MenuData = {
  ok: false,
  items: [],
  categories: [],
  modifierCategories: [],
  modifiers: [],
};

type RawDoc = Record<string, unknown> & { id?: string };

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function fetchJson(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

function isVisible(item: RawDoc): boolean {
  return item.available !== false && item.isAvailable !== false && item.isActive !== false;
}

export async function getMenuData(): Promise<MenuData> {
  try {
    const [menuData, modifierData] = await Promise.all([
      fetchJson('/api/v1/menu'),
      fetchJson('/api/v1/modifiers').catch(() => ({}) as Record<string, unknown>),
    ]);

    const rawCategories = (menuData.categories ?? []) as RawDoc[];
    const rawItems = (menuData.menuItems ?? menuData.items ?? []) as RawDoc[];

    // Items reference their category by id; a few legacy ones only carry the
    // name. Index both so neither kind loses its category (and its blurb).
    const categoryById = new Map<string, RawDoc>();
    const categoryByName = new Map<string, RawDoc>();
    for (const category of rawCategories) {
      const id = str(category.id);
      const name = str(category.name).toLowerCase();
      if (id && !categoryById.has(id)) categoryById.set(id, category);
      if (name && !categoryByName.has(name)) categoryByName.set(name, category);
    }

    const items: MenuItem[] = rawItems
      .filter(isVisible)
      .map((item) => {
        const linked =
          categoryById.get(str(item.categoryId)) ??
          categoryByName.get(str(item.categoryName ?? item.category).toLowerCase()) ??
          null;
        const category = str(linked?.name) || str(item.categoryName ?? item.category);

        return {
          id: str(item.id),
          name: str(item.name),
          description: str(item.description),
          price: num(item.basePrice ?? item.price, 0),
          category,
          available: true,
          imageUrl: str(item.imageUrl) || undefined,
          displayOrder: num(item.displayOrder, 999),
          categoryOrder: num(linked?.displayOrder ?? item.categoryOrder, 999),
          modifierCategoryIds: Array.isArray(item.modifierCategoryIds)
            ? (item.modifierCategoryIds as unknown[]).map(str).filter(Boolean)
            : [],
        };
      })
      // An item whose category was deleted has nowhere to sit on the page.
      .filter((item) => Boolean(item.category));

    items.sort((a, b) => {
      const catOrderA = a.categoryOrder ?? 999;
      const catOrderB = b.categoryOrder ?? 999;
      if (catOrderA !== catOrderB) return catOrderA - catOrderB;

      const catCompare = a.category.localeCompare(b.category);
      if (catCompare !== 0) return catCompare;

      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;

      return a.name.localeCompare(b.name);
    });

    const descriptionByCategory = new Map<string, string>();
    for (const category of rawCategories) {
      const name = str(category.name);
      if (name && !descriptionByCategory.has(name)) {
        descriptionByCategory.set(name, str(category.description));
      }
    }

    // Categories in menu order, limited to the ones that actually have items.
    const categories: MenuCategory[] = [];
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.category)) continue;
      seen.add(item.category);
      categories.push({
        name: item.category,
        description: descriptionByCategory.get(item.category) ?? '',
      });
    }

    const modifierCategories = ((modifierData.modifierCategories ?? []) as RawDoc[])
      .map((doc) => ({
        id: str(doc.id),
        name: str(doc.name),
        displayOrder: num(doc.displayOrder, 999),
        // Passed through as-is (including undefined) so presence, not value,
        // decides which spelling wins in getModifierRule().
        minSelection: doc.minSelection as number | undefined,
        maxSelection: doc.maxSelection as number | undefined,
        minSelections: doc.minSelections as number | undefined,
        maxSelections: doc.maxSelections as number | undefined,
        isRequired: doc.isRequired as boolean | undefined,
        required: doc.required as boolean | undefined,
      }))
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    const modifiers = ((modifierData.modifiers ?? []) as RawDoc[])
      .filter((doc) => doc.isActive !== false)
      .map((doc) => ({
        id: str(doc.id),
        name: str(doc.name),
        price: num(doc.price, 0),
        modifierCategoryId: str(doc.modifierCategoryId),
        isActive: true,
      }));

    return {
      ok: true,
      items,
      categories,
      modifierCategories,
      modifiers,
    };
  } catch (error: unknown) {
    console.error(
      'getMenuData failed:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return EMPTY;
  }
}
