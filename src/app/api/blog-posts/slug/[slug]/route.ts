import { NextResponse } from 'next/server'

// Datos de blog posts
const blogPosts = [
  {
    id: 1,
    title: "Guía Completa del NIE: Todo lo que necesitas saber",
    slug: "guia-completa-nie-espana",
    excerpt: "El NIE es fundamental para vivir en España. Te explicamos paso a paso cómo obtenerlo y qué documentos necesitas.",
    content: `<h2>¿Qué es el NIE?</h2>
    <p>El Número de Identidad de Extranjero (NIE) es un código personal, único y exclusivo para identificar al extranjero en España. Es fundamental para cualquier trámite oficial que necesites realizar en el país.</p>
    
    <h3>Documentos necesarios:</h3>
    <ul>
      <li>Pasaporte original y copia</li>
      <li>Formulario EX-15 cumplimentado</li>
      <li>Justificación del motivo de la solicitud</li>
      <li>Tasa modelo 790 código 012 (12€)</li>
    </ul>
    
    <h3>Proceso paso a paso:</h3>
    <ol>
      <li>Descarga y completa el formulario EX-15</li>
      <li>Paga la tasa correspondiente</li>
      <li>Solicita cita previa online o por teléfono</li>
      <li>Acude a la cita con toda la documentación</li>
      <li>Recoge tu NIE en la fecha indicada</li>
    </ol>`,
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
    content: `<h2>Los mejores barrios para colombianos en Madrid</h2>
    <p>Madrid ofrece una gran variedad de barrios, cada uno con su personalidad única. Como colombiano, es importante elegir un área que se adapte a tu presupuesto y estilo de vida.</p>
    
    <h3>Barrios recomendados:</h3>
    
    <h4>1. Usera</h4>
    <p>Conocido como el "pequeño Bogotá", tiene una gran comunidad latina y precios accesibles.</p>
    <ul>
      <li>Alquiler promedio: 500-700€</li>
      <li>Transporte: Línea 6 del metro</li>
      <li>Ventajas: Comunidad colombiana, restaurantes latinos</li>
    </ul>
    
    <h4>2. Carabanchel</h4>
    <p>Barrio en crecimiento con buena conexión al centro de Madrid.</p>
    <ul>
      <li>Alquiler promedio: 600-900€</li>
      <li>Transporte: Líneas 5 y 6 del metro</li>
      <li>Ventajas: Precios moderados, en desarrollo</li>
    </ul>`,
    category: "Vivienda y Alojamiento",
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    publishedAt: "2024-01-10T14:30:00Z",
    status: "publicado"
  }
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const post = blogPosts.find(p => p.slug === slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}