import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getSavedOrder(): Promise<string[]> {
  try {
    const res = await fetch(`${FS_BASE}/menuBoardConfig/adsOrder?key=${API_KEY}`);
    if (!res.ok) return [];
    const data = await res.json() as { fields?: { order?: { arrayValue?: { values?: { stringValue?: string }[] } } } };
    return data.fields?.order?.arrayValue?.values?.map(v => v.stringValue ?? '').filter(Boolean) ?? [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [storageRes, savedOrder] = await Promise.all([
      fetch(`https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?prefix=${encodeURIComponent('menu-board-ads/')}&key=${API_KEY}`),
      getSavedOrder(),
    ]);

    if (!storageRes.ok) throw new Error(`Storage list: ${storageRes.status}`);
    const data = await storageRes.json() as { items?: { name: string }[] };

    const raw = (data.items ?? [])
      .filter(item => !item.name.endsWith('/'))
      .map(item => ({
        name: item.name.split('/').pop() ?? item.name,
        url: `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(item.name)}?alt=media`,
      }));

    // Apply saved order: ordered items first, then any new unseen items appended
    const ordered = savedOrder
      .map(name => raw.find(i => i.name === name))
      .filter((i): i is { name: string; url: string } => !!i);
    const unseen = raw.filter(i => !savedOrder.includes(i.name));
    const images = [...ordered, ...unseen];

    return NextResponse.json({ images });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
