import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase — only once per module
const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
// Use memory-only cache so Firestore never tries to open IndexedDB.
// IndexedDB initialization hangs silently in some TV/Chromecast/embedded browsers,
// blocking getDocs() forever. Memory cache means no offline persistence but instant
// startup — correct for a public website.
export const db = isFirstInit
  ? initializeFirestore(app, { localCache: memoryLocalCache() })
  : getFirestore(app);
export const storage = getStorage(app);

export default app;
