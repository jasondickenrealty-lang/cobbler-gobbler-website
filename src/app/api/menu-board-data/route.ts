import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [menuSnap, modCatSnap, modSnap, settingsSnap] = await Promise.all([
      getDocs(query(collection(db, 'menu'), where('available', '==', true))),
      getDocs(collection(db, 'modifierCategories')),
      getDocs(collection(db, 'modifiers')),
      getDoc(doc(db, 'settings', 'menuBoard')).catch(() => null),
    ]);

    const items = menuSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const modifierCategories = modCatSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const modifiers = modSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const settings = settingsSnap?.exists() ? (settingsSnap.data() as Record<string, unknown>) : {};
    const videoUrl = (settings.videoUrl as string) ?? null;

    return NextResponse.json({ items, modifierCategories, modifiers, videoUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('menu-board-data error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
