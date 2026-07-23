import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Use Firestore REST API instead of the Client SDK — the Client SDK uses gRPC which
// drops its TLS connection in Vercel serverless functions, causing getDocs() to silently
// return 0 documents from its empty memory cache. Plain fetch() over HTTPS has no such issue.
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://us-central1-cobblestone-pos.cloudfunctions.net/api'
).replace(/\/$/, '');
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type FsValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } };

type FsDoc = { name: string; fields?: Record<string, FsValue> };

function parseValue(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(parseValue);
  if ('mapValue' in v) return parseFields(v.mapValue.fields ?? {});
  return undefined;
}

function parseFields(fields: Record<string, FsValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, parseValue(v)]));
}

function parseDoc(doc: FsDoc): Record<string, unknown> & { id: string } {
  return { id: doc.name.split('/').pop()!, ...parseFields(doc.fields ?? {}) };
}

async function listCollection(col: string) {
  const res = await fetch(`${FS_BASE}/${col}?key=${API_KEY}&pageSize=300`);
  if (!res.ok) throw new Error(`Firestore ${col}: ${res.status}`);
  const data = await res.json() as { documents?: FsDoc[] };
  return (data.documents ?? []).map(parseDoc);
}

async function getDocument(path: string) {
  const res = await fetch(`${FS_BASE}/${path}?key=${API_KEY}`);
  if (!res.ok) return null;
  return parseDoc(await res.json() as FsDoc);
}

async function fetchJson(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

type RawItem = Record<string, unknown> & { id: string };

function isVisibleMenuItem(item: Record<string, unknown>) {
  return item.available !== false && item.isAvailable !== false && item.isActive !== false;
}

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function looksLikeGeneratedId(value: unknown): boolean {
  const trimmed = String(value || '').trim();
  if (!trimmed) return true;
  if (trimmed.length >= 14 && /^[A-Za-z0-9_-]+$/.test(trimmed)) return true;
  if (!/\s/.test(trimmed) && /\d/.test(trimmed) && /[A-Za-z]/.test(trimmed) && trimmed.length >= 10) return true;
  return false;
}

function normalizeMenuItem(
  item: RawItem,
  categoryById: Map<string, Record<string, unknown> & { id: string }>,
) {
  const categoryId = String(item.categoryId || '').trim();
  const linkedCategory = categoryId ? categoryById.get(categoryId) : null;
  const rawCategory = item.categoryName ?? item.category ?? linkedCategory?.name ?? categoryId;
  // When the raw value is just an ID, the only usable name comes from the linked
  // category. If that category is gone the item is orphaned — it can't be placed
  // on the board, and inventing a label would put deleted-category items on the
  // TVs where POS settings can't even see them to remove.
  const category = looksLikeGeneratedId(rawCategory)
    ? (linkedCategory?.name ? String(linkedCategory.name).trim() : null)
    : String(rawCategory).trim();

  return {
    ...item,
    category,
    categoryOrder: toNumber(linkedCategory?.displayOrder ?? item.categoryOrder, 999),
    price: toNumber(item.basePrice ?? item.price, 0),
  };
}

/** Drops orphans whose category could not be resolved. */
function hasResolvedCategory<T extends { category: string | null }>(
  item: T,
): item is T & { category: string } {
  return Boolean(item.category);
}

async function loadTenantMenuData() {
  const [menuData, modifierData, settings] = await Promise.all([
    fetchJson('/api/v1/menu'),
    fetchJson('/api/v1/modifiers'),
    getDocument('settings/menuBoard').catch(() => null),
  ]);

  const categories = (menuData.categories ?? []) as (Record<string, unknown> & { id: string })[];
  const categoryById = new Map<string, Record<string, unknown> & { id: string }>();
  for (const category of categories) {
    categoryById.set(String(category.id), category);
  }

  const items = ((menuData.menuItems ?? menuData.items ?? []) as RawItem[])
    .filter(isVisibleMenuItem)
    .map(item => normalizeMenuItem(item, categoryById))
    .filter(hasResolvedCategory);
  const modifierCategories = modifierData.modifierCategories ?? [];
  const modifiers = modifierData.modifiers ?? [];
  const videoUrl = (settings?.videoUrl as string) ?? null;

  return { items, modifierCategories, modifiers, videoUrl };
}

async function loadLegacyFlatMenuData() {
  const [menuDocs, menuItemsDocs, categoryDocs, modCatDocs, modDocs, settings] = await Promise.all([
    listCollection('menu'),
    listCollection('menuItems'),
    listCollection('categories'),
    listCollection('modifierCategories'),
    listCollection('modifiers'),
    getDocument('settings/menuBoard').catch(() => null),
  ]);

  const categories = [
    ...categoryDocs,
    ...menuDocs.filter(doc => doc.name && !('basePrice' in doc) && !('price' in doc)),
  ];
  const categoryById = new Map<string, Record<string, unknown> & { id: string }>();
  for (const category of categories) {
    const id = String(category.id);
    if (!categoryById.has(id)) {
      categoryById.set(id, category as Record<string, unknown> & { id: string });
    }
  }
  const rawItems = [
    ...menuItemsDocs,
    ...menuDocs.filter(doc => 'basePrice' in doc || 'price' in doc),
  ] as RawItem[];
  const dedupedByName = new Map<string, RawItem>();
  for (const item of rawItems) {
    const key = ((item.name as string | undefined) ?? item.id).toString().trim().toLowerCase();
    if (!dedupedByName.has(key)) dedupedByName.set(key, item);
  }
  const items = [...dedupedByName.values()]
    .filter(isVisibleMenuItem)
    .map(item => normalizeMenuItem(item, categoryById))
    .filter(hasResolvedCategory);
  const modifierCategories = modCatDocs;
  const modifiers = modDocs;
  const videoUrl = (settings?.videoUrl as string) ?? null;

  return { items, modifierCategories, modifiers, videoUrl };
}

export async function GET() {
  try {
    try {
      return NextResponse.json(await loadTenantMenuData());
    } catch (tenantError) {
      console.warn(
        'menu-board-data tenant API fallback:',
        tenantError instanceof Error ? tenantError.message : String(tenantError),
      );
      return NextResponse.json(await loadLegacyFlatMenuData());
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('menu-board-data error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
