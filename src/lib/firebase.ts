import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
console.log("Firebase App initialized with project:", firebaseConfig.projectId);

// Initialize Firestore with specific database ID if provided, otherwise use default
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
console.log("Firestore initialized with DB ID:", firebaseConfig.firestoreDatabaseId || "(default)");

export const storage = getStorage(app);

export const auth = getAuth(app);

export default app;
