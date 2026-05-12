import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
};

// Initialize Firebase — only once per module. Everything is wrapped in try/catch so
// the module loads cleanly during Next.js build-time module evaluation (worker threads
// may not have env vars yet). Null exports are safe because force-dynamic routes are
// never called during build; errors surface at request time if config is truly missing.
let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;
let _storage: ReturnType<typeof getStorage> | null = null;

try {
  const isFirstInit = getApps().length === 0;
  _app = isFirstInit ? initializeApp(firebaseConfig) : getApps()[0];
  _auth = getAuth(_app);
  // Use memory-only cache so Firestore never tries to open IndexedDB.
  // IndexedDB initialization hangs silently in some TV/Chromecast/embedded browsers,
  // blocking getDocs() forever. Memory cache means no offline persistence but instant
  // startup — correct for a public website.
  _db = isFirstInit
    ? initializeFirestore(_app, { localCache: memoryLocalCache() })
    : getFirestore(_app);
  _storage = getStorage(_app);
} catch {
  // Initialization failed — leave exports as null.
}

export const auth = _auth as ReturnType<typeof getAuth>;
export const db = _db as ReturnType<typeof getFirestore>;
export const storage = _storage as ReturnType<typeof getStorage>;
export default _app as ReturnType<typeof initializeApp>;
