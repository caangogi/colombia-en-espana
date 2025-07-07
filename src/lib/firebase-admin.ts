// Firebase Admin SDK Configuration
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

let adminApp: App;

function getAdminApp() {
  if (getApps().length === 0) {
    try {
      console.log('🔧 Initializing Firebase Admin SDK...');
      
      // Get environment variables
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      
      if (!privateKey || !projectId || !clientEmail) {
        console.error('❌ Missing Firebase Admin credentials:', {
          hasPrivateKey: !!privateKey,
          hasProjectId: !!projectId,
          hasClientEmail: !!clientEmail
        });
        throw new Error('Missing Firebase Admin credentials');
      }
      
      // Clean up private key format more carefully
      let cleanPrivateKey = privateKey;
      
      // Replace escaped newlines with actual newlines
      cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
      
      // Remove surrounding quotes if present
      if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
        cleanPrivateKey = cleanPrivateKey.slice(1, -1);
      }
      
      // Replace escaped newlines again (in case they were double-escaped)
      cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
      
      console.log('✅ Firebase Admin credentials found');
      console.log('Key format check:', {
        startsWithBegin: cleanPrivateKey.includes('-----BEGIN'),
        endsWithEnd: cleanPrivateKey.includes('-----END'),
        hasNewlines: cleanPrivateKey.includes('\n'),
        keyLength: cleanPrivateKey.length
      });
      
      const serviceAccount = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: cleanPrivateKey,
      };
      
      adminApp = initializeApp({
        credential: credential.cert(serviceAccount),
        projectId: projectId,
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Firebase Admin:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  } else {
    adminApp = getApps()[0] as App;
  }
  
  return adminApp;
}

export const adminAuth = getAdminAuth(getAdminApp());
export const adminDb = getAdminFirestore(getAdminApp());

// Types for user creation
export interface CreateUserRequest {
  email: string;
  password: string;
  role?: 'guest' | 'admin' | 'anunciante';
  firstName?: string;
  lastName?: string;
}

export interface CreateUserResponse {
  uid: string;
  email: string;
  profile: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    credits: number;
    monthlyCredits: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Admin service for atomic user creation
export class FirebaseAdminService {
  static async createUserWithProfile(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const { email, password, role = 'guest', firstName, lastName } = userData;
    
    try {
      console.log('🔧 Creating user with Firebase Admin SDK:', { email, role });
      
      // Step 1: Create user in Firebase Auth
      const userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: false,
        disabled: false,
      });
      
      console.log('✅ User created in Auth:', userRecord.uid);
      
      // Step 2: Create user profile in Firestore
      const now = new Date();
      const profileData = {
        id: userRecord.uid,
        email,
        role,
        firstName: firstName || '',
        lastName: lastName || '',
        credits: role === 'anunciante' ? 100 : 0,
        monthlyCredits: role === 'anunciante' ? 100 : 0,
        createdAt: now,
        updatedAt: now,
      };
      
      await adminDb.collection('users').doc(userRecord.uid).set(profileData);
      
      console.log('✅ Profile created in Firestore:', userRecord.uid);
      
      return {
        uid: userRecord.uid,
        email,
        profile: profileData,
      };
      
    } catch (error) {
      console.error('❌ Error creating user with profile:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('email-already-exists')) {
          throw new Error('Ya existe una cuenta con este email.');
        }
        if (error.message.includes('weak-password')) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        if (error.message.includes('invalid-email')) {
          throw new Error('El formato del email no es válido.');
        }
      }
      
      throw new Error('Error al crear la cuenta. Intenta nuevamente.');
    }
  }
  
  static async getUserProfile(uid: string) {
    try {
      const doc = await adminDb.collection('users').doc(uid).get();
      
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Error al obtener el perfil de usuario.');
    }
  }
  
  static async updateUserRole(uid: string, role: 'guest' | 'admin' | 'anunciante') {
    try {
      await adminDb.collection('users').doc(uid).update({
        role,
        updatedAt: new Date(),
      });
      
      console.log('✅ User role updated:', { uid, role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Error al actualizar el rol de usuario.');
    }
  }
}