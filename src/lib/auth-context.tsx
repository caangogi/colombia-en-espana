'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from './firestore-schemas';
import { UserProfileService } from './firestore-service';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: { role?: UserProfile['role'] }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserProfile['role']) => boolean;
  isAdmin: () => boolean;
  isAnunciante: () => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile via API
  const fetchUserProfileAPI = async (user: User): Promise<UserProfile | null> => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.success ? result.profile : null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile via API:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!auth?.app) {
      console.log('Firebase not configured yet');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Try to get user profile via API
        const profile = await fetchUserProfileAPI(firebaseUser);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth?.app) {
      throw new Error('Firebase no está configurado.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, userData?: { role?: UserProfile['role'] }) => {
    try {
      if (!auth?.app) {
        throw new Error('Firebase no está configurado.');
      }
      
      // Create user with Firebase Auth Client SDK
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ User created in Firebase Auth:', user.uid);
      
      // Create user profile in Firestore
      const profileData = {
        email: user.email!,
        name: user.displayName || email.split('@')[0],
        role: userData?.role || 'guest',
        subscription: {
          isActive: false,
          plan: 'free',
          credits: 0
        }
      };
      
      await UserProfileService.createProfile(user.uid, profileData);
      console.log('✅ User profile created in Firestore');
      
    } catch (error) {
      console.error('Error creating user account:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth?.app) {
      throw new Error('Firebase no está configurado.');
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfileAPI(user);
      setUserProfile(profile);
    }
  };

  const hasRole = (role: UserProfile['role']) => {
    return userProfile?.role === role;
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isAnunciante = () => {
    return userProfile?.role === 'anunciante';
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    hasRole,
    isAdmin,
    isAnunciante,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}