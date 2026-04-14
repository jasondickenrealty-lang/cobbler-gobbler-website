import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  Pragma: 'no-cache',
  Expires: '0',
};

function jsonNoStore(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

interface ColoringPageDoc {
  title?: string;
  downloadUrl?: string;
  active?: boolean;
  downloadCount?: number;
  createdAt?: unknown;
}

interface FirestoreRestDoc {
  name: string;
  fields?: {
    title?: { stringValue?: string };
    downloadUrl?: { stringValue?: string };
    active?: { booleanValue?: boolean };
    downloadCount?: { integerValue?: string; doubleValue?: number };
  };
}

const FALLBACK_COLORING_PROJECT_ID =
  process.env.COLORING_PAGES_PROJECT_ID?.trim() || 'cobblestone-pos';

// Firebase web API keys are public identifiers; this fallback key is only used
// by the server route when the primary project config returns no pages.
const FALLBACK_COLORING_API_KEY =
  process.env.COLORING_PAGES_API_KEY?.trim() ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
  'AIzaSyANRgxNQe16pM9pb2BaORbJkQvPoHP_eR8';

function toSafeDownloadCount(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function mapRestDocToPage(doc: FirestoreRestDoc) {
  const fields = doc.fields || {};
  const active = fields.active?.booleanValue;
  const downloadUrl = (fields.downloadUrl?.stringValue || '').toString();
  if (!downloadUrl || active === false) return null;

  return {
    id: (doc.name?.split('/').pop() || '').toString(),
    title: (fields.title?.stringValue || '').toString(),
    downloadUrl,
    downloadCount: toSafeDownloadCount(
      fields.downloadCount?.integerValue ?? fields.downloadCount?.doubleValue
    ),
  };
}

async function fetchPagesFromRest(projectId: string, apiKey: string) {
  if (!projectId || !apiKey) return [];

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/coloringPages?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Firestore REST failed (${res.status})`);
  }

  const data = (await res.json()) as { documents?: FirestoreRestDoc[] };
  return (data.documents || []).map(mapRestDocToPage).filter(Boolean);
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

    if (pages.length > 0) {
      return jsonNoStore({ pages });
    }

    const fallbackPages = await fetchPagesFromRest(
      FALLBACK_COLORING_PROJECT_ID,
      FALLBACK_COLORING_API_KEY
    );
    if (fallbackPages.length > 0) {
      console.warn(
        `free-kids-scoop: primary query returned no pages; serving fallback pages from ${FALLBACK_COLORING_PROJECT_ID}`
      );
      return jsonNoStore({ pages: fallbackPages });
    }

    return jsonNoStore({ pages: [] });
  } catch (error) {
    try {
      const fallbackPages = await fetchPagesFromRest(
        FALLBACK_COLORING_PROJECT_ID,
        FALLBACK_COLORING_API_KEY
      );
      if (fallbackPages.length > 0) {
        console.warn(
          'Error fetching coloring pages from primary source, served fallback source instead:',
          error
        );
        return jsonNoStore({ pages: fallbackPages });
      }
    } catch (fallbackError) {
      console.error('Fallback coloring pages query failed:', fallbackError);
    }

    console.error('Error fetching coloring pages:', error);
    return jsonNoStore({ error: 'Failed to load coloring pages' }, 500);
  }
}
