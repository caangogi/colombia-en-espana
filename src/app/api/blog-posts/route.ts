import { NextResponse } from 'next/server'

// Datos de blog posts de ejemplo para mostrar
const blogPosts = [
  {
    id: 1,
    title: "Guía Completa del NIE: Todo lo que necesitas saber",
    slug: "guia-completa-nie-espana",
    excerpt: "El NIE es fundamental para vivir en España. Te explicamos paso a paso cómo obtenerlo y qué documentos necesitas.",
    content: "El Número de Identidad de Extranjero (NIE) es un documento esencial...",
    category: "Trámites y Documentación",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-15T10:00:00Z",
    status: "publicado"
  },
  {
    id: 2,
    title: "Mejores barrios para vivir en Madrid como colombiano",
    slug: "mejores-barrios-madrid-colombianos",
    excerpt: "Descubre los barrios de Madrid más populares entre la comunidad colombiana y por qué son ideales para empezar tu nueva vida.",
    content: "Madrid ofrece una gran variedad de barrios, cada uno con su personalidad...",
    category: "Vivienda y Alojamiento",
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-10T14:30:00Z",
    status: "publicado"
  },
  {
    id: 3,
    title: "Cómo abrir una cuenta bancaria en España siendo extranjero",
    slug: "abrir-cuenta-bancaria-espana-extranjero",
    excerpt: "Proceso paso a paso para abrir tu primera cuenta bancaria en España, documentos necesarios y mejores bancos para extranjeros.",
    content: "Abrir una cuenta bancaria en España es uno de los primeros pasos...",
    category: "Gestión Financiera",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-08T09:15:00Z",
    status: "publicado"
  },
  {
    id: 4,
    title: "Sistema de salud español: Cómo registrarte y obtener tarjeta sanitaria",
    slug: "sistema-salud-espanol-tarjeta-sanitaria",
    excerpt: "Todo sobre el sistema de salud en España: cómo acceder, registrarte en el centro de salud y obtener tu tarjeta sanitaria.",
    content: "El sistema de salud español es uno de los mejores del mundo...",
    category: "Salud y Bienestar",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-05T16:45:00Z",
    status: "publicado"
  },
  {
    id: 5,
    title: "Búsqueda de empleo en España: Portales y estrategias efectivas",
    slug: "busqueda-empleo-espana-colombianos",
    excerpt: "Mejores portales de empleo, cómo adaptar tu CV al mercado español y estrategias para encontrar trabajo rápidamente.",
    content: "Encontrar empleo en España requiere conocer el mercado laboral...",
    category: "Empleo y Trabajo",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-03T11:20:00Z",
    status: "publicado"
  },
  {
    id: 6,
    title: "Cultura española: Tradiciones y costumbres que debes conocer",
    slug: "cultura-espanola-tradiciones-costumbres",
    excerpt: "Inmersión cultural: horarios, tradiciones, festividades y costumbres españolas que facilitarán tu integración.",
    content: "España tiene una rica cultura con tradiciones milenarias...",
    category: "Cultura e Integración",
    imageUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-01T08:00:00Z",
    status: "publicado"
  },
  {
    id: 7,
    title: "Transporte público en Madrid: Guía completa de metro, autobús y cercanías",
    slug: "transporte-publico-madrid-guia-completa",
    excerpt: "Todo sobre el transporte en Madrid: tarifas, abonos, horarios y consejos para moverte como un local.",
    content: "El sistema de transporte público de Madrid es excelente...",
    category: "Vida Práctica",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-28T15:30:00Z",
    status: "publicado"
  },
  {
    id: 8,
    title: "Homologación de títulos universitarios en España",
    slug: "homologacion-titulos-universitarios-espana",
    excerpt: "Proceso completo para homologar tu título universitario colombiano en España y ejercer tu profesión.",
    content: "La homologación de títulos es crucial para ejercer tu profesión...",
    category: "Educación y Formación",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-25T12:00:00Z",
    status: "publicado"
  },
  {
    id: 9,
    title: "Cómo conseguir el certificado de antecedentes penales para España",
    slug: "certificado-antecedentes-penales-espana",
    excerpt: "Guía paso a paso para obtener el certificado de antecedentes penales necesario para trámites en España.",
    content: "El certificado de antecedentes penales es requerido para varios trámites...",
    category: "Trámites y Documentación",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-22T09:45:00Z",
    status: "publicado"
  },
  {
    id: 10,
    title: "Seguro médico privado vs público en España: ¿Cuál elegir?",
    slug: "seguro-medico-privado-vs-publico-espana",
    excerpt: "Comparativa detallada entre el sistema público y privado de salud en España para tomar la mejor decisión.",
    content: "Elegir entre seguro público y privado depende de varios factores...",
    category: "Salud y Bienestar",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-20T14:15:00Z",
    status: "publicado"
  },
  {
    id: 11,
    title: "Gastronomía española: Platos típicos que debes probar",
    slug: "gastronomia-espanola-platos-tipicos",
    excerpt: "Descubre los sabores de España: desde la paella valenciana hasta el jamón ibérico, una guía gastronómica completa.",
    content: "La gastronomía española es una de las más ricas del mundo...",
    category: "Cultura e Integración",
    imageUrl: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-18T18:20:00Z",
    status: "publicado"
  },
  {
    id: 12,
    title: "Cómo alquilar un piso en España: Contratos y fianzas",
    slug: "alquilar-piso-espana-contratos-fianzas",
    excerpt: "Todo lo que necesitas saber sobre alquileres en España: tipos de contrato, fianzas, y derechos del inquilino.",
    content: "Alquilar una vivienda en España tiene sus particularidades...",
    category: "Vivienda y Alojamiento",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-15T11:30:00Z",
    status: "publicado"
  },
  {
    id: 13,
    title: "Impuestos en España para extranjeros: Guía básica",
    slug: "impuestos-espana-extranjeros-guia-basica",
    excerpt: "Introducción al sistema fiscal español: IRPF, IVA y obligaciones tributarias para residentes extranjeros.",
    content: "El sistema fiscal español puede parecer complejo al principio...",
    category: "Gestión Financiera",
    imageUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-12T16:00:00Z",
    status: "publicado"
  },
  {
    id: 14,
    title: "Trabajar como freelance en España: Autónomos y facturación",
    slug: "trabajar-freelance-espana-autonomos",
    excerpt: "Guía completa para trabajar por cuenta propia en España: darse de alta como autónomo, facturación y obligaciones.",
    content: "El trabajo freelance en España requiere darse de alta como autónomo...",
    category: "Empleo y Trabajo",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-10T13:45:00Z",
    status: "publicado"
  },
  {
    id: 15,
    title: "Idioma español vs colombiano: Diferencias y adaptación",
    slug: "idioma-espanol-vs-colombiano-diferencias",
    excerpt: "Principales diferencias lingüísticas entre el español de España y Colombia, y consejos para adaptarte rápidamente.",
    content: "Aunque compartimos el idioma, existen diferencias notables...",
    category: "Cultura e Integración",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-08T10:15:00Z",
    status: "publicado"
  },
  {
    id: 16,
    title: "Preparación para entrevistas de trabajo en España",
    slug: "preparacion-entrevistas-trabajo-espana",
    excerpt: "Consejos y estrategias para brillar en entrevistas laborales españolas: protocolo, preguntas típicas y follow-up.",
    content: "Las entrevistas de trabajo en España tienen sus propias características...",
    category: "Empleo y Trabajo",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2023-12-05T08:30:00Z",
    status: "borrador"
  }
]

export async function GET() {
  try {
    // Filtrar solo posts publicados
    const publishedPosts = blogPosts.filter(post => post.status === 'publicado')
    
    return NextResponse.json(publishedPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}