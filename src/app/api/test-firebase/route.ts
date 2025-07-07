import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log('🔧 Testing Firebase Admin connection...');
    
    // Test 1: Check if auth is initialized
    const authTest = await adminAuth.listUsers(1);
    console.log('✅ Firebase Auth test passed:', authTest.users.length);
    
    // Test 2: Check if Firestore is initialized
    const dbTest = await adminDb.collection('test').limit(1).get();
    console.log('✅ Firestore test passed:', dbTest.size);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin is working correctly',
      tests: {
        auth: 'passed',
        firestore: 'passed'
      }
    });
    
  } catch (error) {
    console.error('❌ Firebase Admin test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}