import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { FEATURED_FLAVOR_NAMES } from '@/shared/featured-flavors';

export const runtime = 'nodejs';

type FlavorItem = {
  name: string;
  price: number | null;
  source: 'modifier' | 'menu' | 'featured-fallback';
  categoryName?: string;
};

const FEATURED_FALLBACK_FLAVORS = FEATURED_FLAVOR_NAMES;

function isFlavorCategoryName(categoryName: string) {
  return /(flavor|flavour|ice\s*cream|gelato|sorbet|sherbet|soft\s*serve|frozen\s*yogurt)/i.test(categoryName || '');
}

function upsertFlavor(map: Map<string, FlavorItem>, flavor: FlavorItem) {
  const normalized = flavor.name.trim().toLowerCase();
  if (!normalized) return;

  const existing = map.get(normalized);
  if (!existing) {
    map.set(normalized, flavor);
    return;
  }

  if (existing.price == null && flavor.price != null) {
    map.set(normalized, flavor);
  }
}

export async function GET() {
  try {
    const flavorMap = new Map<string, FlavorItem>();

    const [menuSnapshot, modifierCategorySnapshot, modifierSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'menu'), where('available', '==', true))),
      getDocs(collection(db, 'modifierCategories')),
      getDocs(collection(db, 'modifiers')),
    ]);

    const flavorModifierCategoryIds = new Set<string>();
    const modifierCategoryNames = new Map<string, string>();

    modifierCategorySnapshot.docs.forEach((doc) => {
      const data = doc.data() as { name?: string };
      const categoryName = (data?.name || '').toString();
      modifierCategoryNames.set(doc.id, categoryName);
      if (isFlavorCategoryName(categoryName)) {
        flavorModifierCategoryIds.add(doc.id);
      }
    });

    modifierSnapshot.docs.forEach((doc) => {
      const data = doc.data() as { name?: string; price?: number; modifierCategoryId?: string; isActive?: boolean };
      if (data?.isActive === false) return;
      if (!flavorModifierCategoryIds.has((data?.modifierCategoryId || '').toString())) return;

      const price = typeof data?.price === 'number' && Number.isFinite(data.price) ? data.price : null;
      upsertFlavor(flavorMap, {
        name: (data?.name || '').toString(),
        price,
        source: 'modifier',
        categoryName: modifierCategoryNames.get((data?.modifierCategoryId || '').toString()) || undefined,
      });
    });

    menuSnapshot.docs.forEach((doc) => {
      const data = doc.data() as { name?: string; category?: string; price?: number };
      const categoryName = (data?.category || '').toString();
      if (!isFlavorCategoryName(categoryName)) return;

      const price = typeof data?.price === 'number' && Number.isFinite(data.price) ? data.price : null;
      upsertFlavor(flavorMap, {
        name: (data?.name || '').toString(),
        price,
        source: 'menu',
        categoryName,
      });
    });

    if (flavorMap.size === 0) {
      FEATURED_FALLBACK_FLAVORS.forEach((name) => {
        upsertFlavor(flavorMap, { name, price: null, source: 'featured-fallback' });
      });
    }

    const flavors = [...flavorMap.values()].sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      source: '/menu',
      flavors,
    });
  } catch (error: any) {
    console.error('Failed to fetch menu flavors:', error?.message || 'unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch menu flavors. Please try again later.' },
      { status: 500 }
    );
  }
}
