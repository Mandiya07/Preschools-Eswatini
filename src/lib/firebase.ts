import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
console.log("Firebase App initialized with project:", firebaseConfig.projectId);

// Initialize Firestore with long polling enabled to bypass sandboxed stream blocked timeouts
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });
console.log("Firestore initialized with DB ID:", firebaseConfig.firestoreDatabaseId || "(default)");

export const storage = getStorage(app);

export const auth = getAuth(app);

export default app;
