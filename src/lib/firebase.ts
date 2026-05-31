import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import baseConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  ...baseConfig,
  apiKey: (typeof process !== 'undefined' ? process.env?.VITE_FIREBASE_API_KEY : null) || (import.meta as any).env?.VITE_FIREBASE_API_KEY || baseConfig.apiKey,
};

const app = initializeApp(firebaseConfig);
console.log("Firebase App initialized with project:", firebaseConfig.projectId);

// Initialize Firestore with long polling enabled to bypass sandboxed stream blocked timeouts
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });
console.log("Firestore initialized with DB ID:", firebaseConfig.firestoreDatabaseId || "(default)");

export const storage = getStorage(app);

let authInstance: any;
try {
  authInstance = getAuth(app);
} catch (e) {
  console.warn('Firebase Auth initialization failed (likely missing API key):', e);
  authInstance = { app }; // Mock auth object enough for AuthContext to detect missing API key
}

export const auth = authInstance;

export default app;
