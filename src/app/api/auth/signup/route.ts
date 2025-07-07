import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

// Validation schema for signup request
const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['guest', 'admin', 'anunciante']).optional().default('guest'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Initialize Firebase Admin (simplified approach)
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Handle private key format more robustly
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    
    if (!privateKey || !process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      throw new Error('Missing Firebase Admin credentials');
    }
    
    // Clean up the private key format
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Remove extra quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    console.log('Firebase Admin credentials check:', {
      hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      hasPrivateKey: !!privateKey,
      privateKeyStart: privateKey.substring(0, 30),
    });
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  }
  
  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting signup process...');
    
    const body = await request.json();
    console.log('Request body:', { email: body.email, role: body.role });
    
    // Validate request data
    const validatedData = signupSchema.parse(body);
    console.log('Data validation passed');
    
    // Get Firebase Admin services
    const { auth, db } = getFirebaseAdmin();
    
    // Create user in Firebase Auth
    console.log('Creating user in Firebase Auth...');
    const userRecord = await auth.createUser({
      email: validatedData.email,
      password: validatedData.password,
      emailVerified: false,
      disabled: false,
    });
    
    console.log('User created in Auth:', userRecord.uid);
    
    // Create user profile in Firestore
    const now = new Date();
    const profileData = {
      id: userRecord.uid,
      email: validatedData.email,
      role: validatedData.role,
      firstName: validatedData.firstName || '',
      lastName: validatedData.lastName || '',
      credits: validatedData.role === 'anunciante' ? 100 : 0,
      monthlyCredits: validatedData.role === 'anunciante' ? 100 : 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.collection('users').doc(userRecord.uid).set(profileData);
    console.log('Profile created in Firestore:', userRecord.uid);
    
    const result = {
      uid: userRecord.uid,
      email: validatedData.email,
      profile: profileData,
    };
    
    return NextResponse.json({
      success: true,
      user: {
        uid: result.uid,
        email: result.email,
        profile: result.profile,
      },
      message: 'Usuario creado exitosamente',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors.map(e => e.message),
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
    }, { status: 500 });
  }
}