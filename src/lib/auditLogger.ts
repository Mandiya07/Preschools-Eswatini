import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export enum AuditAction {
  LOGIN = 'LOGIN',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CREATE_DOCUMENT = 'CREATE_DOCUMENT',
  UPDATE_DOCUMENT = 'UPDATE_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  CHANGE_SETTINGS = 'CHANGE_SETTINGS'
}

export async function logAudit(
  action: AuditAction,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  try {
    const user = auth.currentUser;
    if (!user) return; // Do not log if unauthenticated as most actions require auth

    await addDoc(collection(db, 'audit_logs'), {
      action,
      resourceType,
      resourceId: resourceId || null,
      details: details || {},
      userId: user.uid,
      userEmail: user.email,
      timestamp: serverTimestamp(),
      ipAddress: 'client-side' // Actually grabbed from server on real backend, but we store minimal info here
    });
  } catch (error) {
    console.warn("Failed to write audit log", error);
    // Silent fail so we don't disrupt user flow
  }
}
