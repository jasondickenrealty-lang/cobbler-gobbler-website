/**
 * Server-side menu loader — single source of truth is the Firestore `menu`,
 * `modifierCategories`, and `modifiers` collections (the same data the POS and
 * ordering app use). Runs on the server so the full menu is rendered into the
 * HTML response and is fully crawlable by Google — no client-side "Loading…"
 * state required.
 *
 * Everything is wrapped in try/catch and guards against a null `db` (which can
 * happen during build-time module evaluation) so a menu fetch failure degrades
 * to a graceful fallback instead of breaking the build or the page.
 */

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

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
}

export interface ModifierCategory {
  id: string;
  name: string;
  displayOrder?: number;
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
  categories: string[];
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

export async function getMenuData(): Promise<MenuData> {
  if (!db) return EMPTY;

  try {
    const [menuSnapshot, mcSnapshot, modSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'menu'), where('available', '==', true))),
      getDocs(collection(db, 'modifierCategories')),
      getDocs(collection(db, 'modifiers')),
    ]);

    const items = menuSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    items.sort((a, b) => {
      const catOrderA = a.categoryOrder ?? 999;
      const catOrderB = b.categoryOrder ?? 999;
      if (catOrderA !== catOrderB) return catOrderA - catOrderB;

      const catCompare = (a.category || '').localeCompare(b.category || '');
      if (catCompare !== 0) return catCompare;

      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;

      return (a.name || '').localeCompare(b.name || '');
    });

    const categories: string[] = [];
    for (const item of items) {
      if (item.category && !categories.includes(item.category)) {
        categories.push(item.category);
      }
    }

    const modifierCategories = mcSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as ModifierCategory)
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    const modifiers = modSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Modifier)
      .filter((m) => m.isActive !== false);

    return {
      ok: true,
      items,
      categories,
      modifierCategories,
      modifiers,
    };
  } catch (error: any) {
    console.error('getMenuData failed:', error?.message || 'unknown error');
    return EMPTY;
  }
}
