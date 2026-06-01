import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Supported media types
const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|svg)$/i;
const VIDEO_EXTS = /\.(mp4|webm|mov)$/i;

function bucketCandidates(): string[] {
  const set = new Set<string>();
  const raw = String(BUCKET || '').trim();
  const projectId = String(PROJECT_ID || '').trim();

  if (raw) {
    set.add(raw);
    if (raw.endsWith('.appspot.com')) set.add(raw.replace(/\.appspot\.com$/i, '.firebasestorage.app'));
    if (raw.endsWith('.firebasestorage.app')) set.add(raw.replace(/\.firebasestorage\.app$/i, '.appspot.com'));
  }

  if (projectId) {
    set.add(`${projectId}.firebasestorage.app`);
    set.add(`${projectId}.appspot.com`);
  }

  return [...set].filter(Boolean);
}

async function fetchStorageListing(bucket: string) {
  const prefix = encodeURIComponent('marketing-display/');
  const urls: string[] = [];
  if (API_KEY) {
    urls.push(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=${prefix}&key=${API_KEY}`);
  }
  urls.push(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=${prefix}`);

  let lastStatus = 'no-response';
  for (const url of urls) {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      return await res.json() as { items?: { name: string }[] };
    }
    lastStatus = String(res.status);
  }

  throw new Error(`Storage list failed for ${bucket} (last status ${lastStatus})`);
}

export async function GET() {
  try {
    const buckets = bucketCandidates();
    if (buckets.length === 0) {
      throw new Error('Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET / NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    }

    let data: { items?: { name: string }[] } | null = null;
    let selectedBucket = buckets[0];
    let listError = 'none';

    for (const bucket of buckets) {
      try {
        data = await fetchStorageListing(bucket);
        selectedBucket = bucket;
        break;
      } catch (err) {
        listError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!data) throw new Error(listError);

    const media = (data.items ?? [])
      .filter(item => !item.name.endsWith('/'))
      .filter(item => IMAGE_EXTS.test(item.name) || VIDEO_EXTS.test(item.name))
      .map(item => ({
        name: item.name.split('/').pop() ?? item.name,
        url: `https://firebasestorage.googleapis.com/v0/b/${selectedBucket}/o/${encodeURIComponent(item.name)}?alt=media`,
        type: VIDEO_EXTS.test(item.name) ? 'video' : 'image',
      }));

    return NextResponse.json({ media });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
