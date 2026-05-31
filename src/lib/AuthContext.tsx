import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged,
  onIdTokenChanged,
  setPersistence,
  browserLocalPersistence,
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
  activeSchoolId: string | null;
  setActiveSchoolId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user_profile');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeSchoolId, setActiveSchoolId] = useState<string | null>(localStorage.getItem('active_school_id'));

  useEffect(() => {
    if (activeSchoolId) {
      localStorage.setItem('active_school_id', activeSchoolId);
    } else {
      localStorage.removeItem('active_school_id');
    }
  }, [activeSchoolId]);

  useEffect(() => {
    if (!auth.app.options.apiKey) {
      console.warn("No Firebase API key provided! Firebase Auth is disabled. Using dev logic only.");
      if (localStorage.getItem('dev_role')) {
        setUser({
          uid: 'dev-123',
          name: 'Dev SuperAdmin',
          email: 'siphom.yati@gmail.com',
          role: localStorage.getItem('dev_role') as Role,
          emailVerified: true
        });
      }
      setLoading(false);
      return;
    }

    // Set Firebase Auth persistence to LOCAL (localStorage)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting persistence:", error);
    });

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

    const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Refresh and save token to localStorage for persistent sessions
        try {
          const token = await fbUser.getIdToken();
          localStorage.setItem('auth_token', token);
        } catch (error) {
          console.error("Error refreshing token:", error);
        }

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
        
        let finalProfile: UserProfile;

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
             finalProfile = updatedProfile;
          } else {
             finalProfile = data;
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
          finalProfile = newProfile;
        }

        setUser(finalProfile);
        localStorage.setItem('user_profile', JSON.stringify(finalProfile));
      } else {
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
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
      activeSchoolId,
      setActiveSchoolId,
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
