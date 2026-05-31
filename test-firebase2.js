import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

try {
  const app = initializeApp({ projectId: 'test', apiKey: '' });
  const db = initializeFirestore(app, {});
  const storage = getStorage(app);
  console.log("SUCCESS");
} catch(e) {
  console.error("ERROR", e.message);
}
