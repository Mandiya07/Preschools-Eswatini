import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  QueryConstraint
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Bulk import preloaded schools helper from JSON
import preloadedSchools from '../data/preloadedSchools.json';

// Detect if Firebase connection settings are valid
export const isFirebaseConfigured = (): boolean => {
  return Boolean(db.app.options.apiKey && db.app.options.apiKey !== 'YOUR_API_KEY');
};

// Memory listeners for localStorage reactive updates
const listeners: Record<string, Set<(data: any[]) => void>> = {};

const triggerListeners = (path: string) => {
  if (listeners[path]) {
    const data = getLocalCollection(path);
    listeners[path].forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error("Error executing listener callback:", err);
      }
    });
  }
};

const getLocalCollection = (path: string): any[] => {
  const key = `local_db_${path}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }


  
  return [];
};

const saveLocalCollection = (path: string, data: any[]) => {
  const key = `local_db_${path}`;
  localStorage.setItem(key, JSON.stringify(data));
  triggerListeners(path);
};

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Timeout helper to bypass 10s hanging when Firestore backend is blocked/unreachable
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore operation timed out (Connection sandboxed or offline)"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export const fetchCollection = async (path: string, ...queryConstraints: QueryConstraint[]) => {
  if (!isFirebaseConfigured()) {
    return getLocalCollection(path);
  }
  try {
    const q = query(collection(db, path), ...queryConstraints);
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const fetchDocument = async (path: string, id: string) => {
  if (!isFirebaseConfigured()) {
    const list = getLocalCollection(path);
    return list.find(item => item.id === id) || null;
  }
  try {
    const docRef = doc(db, path, id);
    const snapshot = await withTimeout(getDoc(docRef));
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
  }
};

export const createDocument = async (path: string, id: string | null, data: any) => {
  if (!isFirebaseConfigured()) {
    const list = getLocalCollection(path);
    const docId = id || `doc-${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = { id: docId, ...data };
    
    const index = list.findIndex(item => item.id === docId);
    if (index >= 0) {
      list[index] = newDoc;
    } else {
      list.push(newDoc);
    }
    
    saveLocalCollection(path, list);
    return docId;
  }
  try {
    if (id) {
      await withTimeout(setDoc(doc(db, path, id), data));
      return id;
    } else {
      const docRef = await withTimeout(addDoc(collection(db, path), data));
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateDocument = async (path: string, id: string, data: any) => {
  if (!isFirebaseConfigured()) {
    const list = getLocalCollection(path);
    const index = list.findIndex(item => item.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...data };
      saveLocalCollection(path, list);
    }
    return;
  }
  try {
    const docRef = doc(db, path, id);
    await withTimeout(updateDoc(docRef, data));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
};

export const deleteDocument = async (path: string, id: string) => {
  if (!isFirebaseConfigured()) {
    const list = getLocalCollection(path);
    const updated = list.filter(item => item.id !== id);
    saveLocalCollection(path, updated);
    return;
  }
  try {
    const docRef = doc(db, path, id);
    await withTimeout(deleteDoc(docRef));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
};

export const subscribeToCollection = (
  path: string, 
  callback: (data: any[]) => void, 
  ...queryConstraints: QueryConstraint[]
) => {
  if (!isFirebaseConfigured()) {
    if (!listeners[path]) {
      listeners[path] = new Set();
    }
    listeners[path].add(callback);
    callback(getLocalCollection(path));
    
    return () => {
      listeners[path]?.delete(callback);
    };
  }
  const q = query(collection(db, path), ...queryConstraints);
  return onSnapshot(
    q, 
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
};

export const bulkImportPreloadedSchools = async (ownerId?: string) => {
  if (!isFirebaseConfigured()) {
    const key = 'local_db_schools';
    const list = getLocalCollection('schools');
    
    // Fallback is already initialized in getLocalCollection, so just return stats
    return { 
      successCount: 0, 
      skipCount: preloadedSchools.length, 
      failCount: 0, 
      total: preloadedSchools.length 
    };
  }

  const collectionName = 'schools';
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const school of preloadedSchools) {
    try {
      const docRef = doc(db, collectionName, school.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          ...school,
          subscriptionStatus: 'inactive', // Override JSON during import to ensure revenue is 0 until claimed
          ownerId: ownerId || auth.currentUser?.uid || 'super_admin_seed',
          createdAt: school.createdAt || new Date().toISOString()
        });
        successCount++;
      } else {
        skipCount++;
      }
    } catch (error) {
      console.error(`Failed to bulk import ${school.name}:`, error);
      failCount++;
    }
  }

  return { 
    successCount, 
    skipCount, 
    failCount, 
    total: preloadedSchools.length 
  };
};

