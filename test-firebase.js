import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

try {
  const app = initializeApp({ projectId: 'test', apiKey: '' });
  const auth = getAuth(app);
  console.log("SUCCESS");
} catch(e) {
  console.error("ERROR", e.message);
}
