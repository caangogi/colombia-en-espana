import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const blogIdeasByCategory = {
  'Trámites y Documentación': [
    'Cómo obtener la nacionalidad española siendo colombiano en 2025',
    'Nuevos requisitos para el NIE español: cambios de enero 2025',
    'Apostilla de documentos colombianos: guía actualizada',
    'Visado de estudiante para España: proceso completo 2025',
    'Homologación de títulos universitarios colombianos en España',
    'Trámites de reagrupación familiar para colombianos',
    'Cómo renovar el permiso de residencia en España',
    'Documentos necesarios para empadronarse en España'
  ],
  'Vida Práctica': [
    'Mejores ciudades españolas para vivir siendo colombiano',
    'Cómo abrir una cuenta bancaria en España sin residencia',
    'Transporte público en Madrid: guía para recién llegados',
    'Dónde comprar productos colombianos en España',
    'Cómo funciona el sistema de salud español para extranjeros',
    'Guía de alquilar piso en España: evita estafas',
    'Comparación de telefonía móvil en España 2025',
    'Supermercados más económicos en las principales ciudades españolas'
  ],
  'Trabajo y Empleo': [
    'Sectores con más oportunidades para colombianos en España',
    'Cómo hacer un CV español que funcione',
    'Portales de empleo más efectivos en España 2025',
    'Derechos laborales de extranjeros en España',
    'Cómo crear tu propia empresa siendo extranjero en España',
    'Trabajar como freelancer en España: requisitos legales',
    'Salarios promedio en España por sector en 2025',
    'Networking profesional para latinoamericanos en España'
  ],
  'Cultura y Sociedad': [
    'Comunidades colombianas más activas en España',
    'Diferencias culturales entre Colombia y España que debes conocer',
    'Festivales latinoamericanos que se celebran en España',
    'Cómo mantener la cultura colombiana viviendo en España',
    'Restaurantes colombianos imperdibles en Madrid y Barcelona',
    'Asociaciones de colombianos en las principales ciudades españolas',
    'Cómo hacer amigos españoles siendo colombiano',
    'Tradiciones españolas que todo colombiano debe conocer'
  ],
  'Finanzas': [
    'Cómo enviar dinero de España a Colombia de forma segura',
    'Mejores bancos en España para extranjeros',
    'Sistema tributario español para residentes extranjeros',
    'Cómo ahorrar dinero viviendo en España',
    'Inversiones seguras en España para latinoamericanos',
    'Diferencias entre el sistema financiero colombiano y español',
    'Cómo solicitar un préstamo en España siendo extranjero',
    'Planificación financiera para el retorno a Colombia'
  ],
  default: [
    'Guía completa para migrar de Colombia a España en 2025',
    'Experiencias reales de colombianos viviendo en España',
    'Errores más comunes al migrar a España y cómo evitarlos',
    'España vs otros destinos europeos para colombianos',
    'Cómo prepararse emocionalmente para migrar a España',
    'Recursos online esenciales para colombianos en España',
    'Calendario de gestiones importantes para nuevos residentes',
    'Red de apoyo para colombianos recién llegados a España'
  ]
};

async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const decodedToken = await verifyAdminToken(request);
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category } = body;

    let ideas: string[] = [];

    if (category && blogIdeasByCategory[category as keyof typeof blogIdeasByCategory]) {
      ideas = blogIdeasByCategory[category as keyof typeof blogIdeasByCategory];
    } else {
      // Mix ideas from all categories
      const allIdeas = Object.values(blogIdeasByCategory).flat();
      ideas = allIdeas.sort(() => Math.random() - 0.5).slice(0, 8);
    }

    // Randomize and return 6-8 ideas
    const shuffledIdeas = ideas.sort(() => Math.random() - 0.5).slice(0, 6);

    return NextResponse.json(shuffledIdeas);

  } catch (error) {
    console.error('Error generating blog ideas:', error);
    return NextResponse.json(
      { error: 'Error generating ideas' },
      { status: 500 }
    );
  }
}