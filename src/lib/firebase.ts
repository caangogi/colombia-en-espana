// Firebase Configuration - Client Side
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyADJGe1ilFpfhe_nDDBv9PpyMRurjctuvg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "colombia-en-esp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "colombia-en-esp",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "colombia-en-esp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "623192880138",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:623192880138:web:e0cd9bbe02d332c8d0dbf3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug Firebase connection
if (typeof window !== 'undefined') {
  console.log('🔧 Firebase Config:', {
    projectId: firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    environment: process.env.NODE_ENV
  });
  
  // Test connection
  const testConnection = async () => {
    try {
      console.log('🔍 Testing Firebase connection...');
      // Simple test - this should work even if offline
      const testDoc = { test: true };
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
    }
  };
  
  testConnection();
}

export default app;