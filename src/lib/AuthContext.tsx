import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type Role = "SuperAdmin" | "SchoolAdmin" | "Parent" | "User" | "Supplier" | "Advertiser";

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  role: Role;
  schoolId?: string;
  subscriptionPlan?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  devLogin?: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('dev_role')) {
      setUser({
        uid: 'dev-123',
        name: 'Dev SuperAdmin',
        email: 'siphom.yati@gmail.com',
        role: localStorage.getItem('dev_role') as Role,
        emailVerified: true
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        const superAdminEmails = ['siphom.yati@gmail.com']; // User's email from metadata
        
        let determinedRole: Role = 'User';
        
        if (fbUser.email && superAdminEmails.includes(fbUser.email)) {
          determinedRole = 'SuperAdmin';
        } else if (fbUser.email) {
            // Check if user is a parent
            const studentQ = query(collection(db, 'students'), where('parentEmail', '==', fbUser.email));
            const studentSnap = await getDocs(studentQ);
            if (!studentSnap.empty) {
                determinedRole = 'Parent';
            } else {
                const appQ = query(collection(db, 'applications'), where('parentEmail', '==', fbUser.email));
                const appSnap = await getDocs(appQ);
                if (!appSnap.empty) {
                    determinedRole = 'Parent';
                }
            }
        }
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          let role = data.role;
          
          if (determinedRole === 'SuperAdmin' && role !== 'SuperAdmin') {
             role = 'SuperAdmin';
          } else if (determinedRole === 'Parent' && role === 'User') {
             role = 'Parent';
          }
          
          if (role !== data.role || data.name !== fbUser.displayName || data.email !== fbUser.email || data.emailVerified !== fbUser.emailVerified) {
             const updatedProfile = { 
               ...data, 
               role, 
               name: fbUser.displayName || data.name, 
               email: fbUser.email,
               emailVerified: fbUser.emailVerified
             };
             await setDoc(userDocRef, updatedProfile, { merge: true });
             setUser(updatedProfile);
          } else {
             setUser(data);
          }
        } else {
          // Create a default profile for new users
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName,
            email: fbUser.email,
            role: determinedRole,
            emailVerified: fbUser.emailVerified
          };
          await setDoc(userDocRef, newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name: string) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(fbUser);
    
    // The profile will be created by the onAuthStateChanged listener
    // But we can pre-set the name if we want
    const userDocRef = doc(db, 'users', fbUser.uid);
    await setDoc(userDocRef, {
      uid: fbUser.uid,
      name,
      email: fbUser.email,
      role: 'User', // Default role
      emailVerified: false
    }, { merge: true });
  };

  const logout = async () => {
    localStorage.removeItem('dev_role');
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error", e);
    }
    setUser(null);
  };

  const devLogin = (role: Role) => {
    localStorage.setItem('dev_role', role);
    setUser({
      uid: 'dev-123',
      name: 'Dev SuperAdmin',
      email: 'siphom.yati@gmail.com',
      role: role,
      emailVerified: true
    });
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithEmail, 
      register, 
      logout,
      devLogin,
      sendEmailVerification: sendVerification
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
