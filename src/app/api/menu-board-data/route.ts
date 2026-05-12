import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Use Firestore REST API instead of the Client SDK — the Client SDK uses gRPC which
// drops its TLS connection in Vercel serverless functions, causing getDocs() to silently
// return 0 documents from its empty memory cache. Plain fetch() over HTTPS has no such issue.
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
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

type RawItem = Record<string, unknown> & { id: string };

function isVisibleMenuItem(item: Record<string, unknown>) {
  return item.available !== false && item.isAvailable !== false && item.isActive !== false;
}

function normalizeMenuItem(item: RawItem) {
  return {
    ...item,
    category: (item.category as string | undefined) ?? (item.categoryId as string | undefined) ?? 'Menu',
  };
}

export async function GET() {
  try {
    const [menuDocs, menuItemsDocs, modCatDocs, modDocs, settings] = await Promise.all([
      listCollection('menu'),
      listCollection('menuItems'),
      listCollection('modifierCategories'),
      listCollection('modifiers'),
      getDocument('settings/menuBoard').catch(() => null),
    ]);

    const rawItems = [...menuDocs, ...menuItemsDocs] as RawItem[];
    const dedupedByName = new Map<string, RawItem>();
    for (const item of rawItems) {
      const key = ((item.name as string | undefined) ?? item.id).toString().trim().toLowerCase();
      if (!dedupedByName.has(key)) dedupedByName.set(key, item);
    }
    const items = [...dedupedByName.values()].filter(isVisibleMenuItem).map(normalizeMenuItem);
    const modifierCategories = modCatDocs;
    const modifiers = modDocs;
    const videoUrl = (settings?.videoUrl as string) ?? null;

    return NextResponse.json({ items, modifierCategories, modifiers, videoUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('menu-board-data error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
