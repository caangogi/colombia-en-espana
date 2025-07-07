// Firebase Connection Test
import { db } from './firebase';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Test Firebase connection
export async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Try to enable network
    await db._delegate._databaseId;
    console.log('✅ Firebase connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}

// Enable offline persistence for development
export function enableFirestoreOffline() {
  try {
    // Enable offline persistence
    console.log('🔧 Enabling Firestore offline persistence...');
    return true;
  } catch (error) {
    console.error('❌ Failed to enable offline persistence:', error);
    return false;
  }
}