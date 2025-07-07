import { NextRequest, NextResponse } from 'next/server';
import { FirebaseAdminService } from '@/lib/firebase-admin';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Token de autorización requerido',
      }, { status: 401 });
    }

    // Extract and verify Firebase ID token
    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user profile from Firestore
    const profile = await FirebaseAdminService.getUserProfile(decodedToken.uid);
    
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Perfil de usuario no encontrado',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      profile,
    });
    
  } catch (error) {
    console.error('Profile API error:', error);
    
    if (error instanceof Error && error.message.includes('auth/id-token-expired')) {
      return NextResponse.json({
        success: false,
        error: 'Token expirado. Inicia sesión nuevamente.',
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener el perfil de usuario',
    }, { status: 500 });
  }
}