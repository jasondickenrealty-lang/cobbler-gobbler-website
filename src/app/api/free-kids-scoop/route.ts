import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';

interface ColoringPageDoc {
  title?: string;
  downloadUrl?: string;
  active?: boolean;
  downloadCount?: number;
  createdAt?: unknown;
}

export async function GET() {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'coloringPages'), orderBy('createdAt', 'desc'))
    );

    const pages = snapshot.docs
      .map((doc) => {
        const data = doc.data() as ColoringPageDoc;
        if (!data.downloadUrl || data.active === false) return null;

        const rawCount = Number(data.downloadCount ?? 0);
        const downloadCount = Number.isFinite(rawCount) ? rawCount : 0;

        return {
          id: doc.id,
          title: (data.title || '').toString(),
          downloadUrl: (data.downloadUrl || '').toString(),
          downloadCount,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching coloring pages:', error);
    return NextResponse.json(
      { error: 'Failed to load coloring pages' },
      { status: 500 }
    );
  }
}
