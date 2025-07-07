import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { UserProfileService } from '@/lib/firestore-service';
import { blogPostSchema } from '@/lib/firestore-schemas';

interface BlogGenerationRequest {
  topic: string;
  category: string;
  tone: 'formal' | 'friendly' | 'informative';
  length: 'short' | 'medium' | 'long';
}

interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
}

async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // For now, simplified auth check - just verify token is valid
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

class BlogAIService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  private selectRandomImage(category: string): string {
    const imageMap: Record<string, string[]> = {
      'Trámites y Documentación': [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400',
        'https://images.unsplash.com/photo-1450101215322-bf5cd27538ff?w=800&h=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400'
      ],
      'Vida Práctica': [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400',
        'https://images.unsplash.com/photo-1486312338219-ce68e2c6079b?w=800&h=400',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400'
      ],
      'Trabajo y Empleo': [
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400',
        'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=400'
      ],
      'Cultura y Sociedad': [
        'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=400',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc3?w=800&h=400',
        'https://images.unsplash.com/photo-1577495508048-b635763cc973?w=800&h=400'
      ],
      default: [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400',
        'https://images.unsplash.com/photo-1486312338219-ce68e2c6079b?w=800&h=400',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400'
      ]
    };

    const images = imageMap[category] || imageMap.default;
    return images[Math.floor(Math.random() * images.length)];
  }

  async generateContent(request: BlogGenerationRequest): Promise<GeneratedBlogContent> {
    // Simulated AI content generation
    // In a real implementation, this would call an AI service like OpenAI or Perplexity
    
    const { topic, category, tone, length } = request;
    
    // Generate title
    const title = this.generateTitle(topic, tone);
    
    // Generate content based on length
    const content = this.generateDetailedContent(topic, category, tone, length);
    
    // Generate excerpt
    const excerpt = this.generateExcerpt(content);
    
    // Generate slug
    const slug = this.generateSlug(title);
    
    // Select image
    const imageUrl = this.selectRandomImage(category);

    return {
      title,
      slug,
      excerpt,
      content,
      category,
      imageUrl
    };
  }

  private generateTitle(topic: string, tone: string): string {
    const prefixes = {
      formal: ['Guía Completa:', 'Manual Oficial:', 'Procedimiento para'],
      friendly: ['Todo lo que necesitas saber sobre', 'Tu guía práctica para', 'Cómo lograr'],
      informative: ['Guía práctica:', 'Información actualizada sobre', 'Pasos para']
    };

    const prefix = prefixes[tone as keyof typeof prefixes] || prefixes.informative;
    const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    
    return `${selectedPrefix} ${topic}`;
  }

  private generateDetailedContent(topic: string, category: string, tone: string, length: string): string {
    const wordCounts = {
      short: 600,
      medium: 1000,
      long: 1500
    };

    // This is a simplified content generation
    // In production, this would use a real AI service
    return `
      <h2>Introducción</h2>
      <p>Si eres colombiano y estás considerando migrar a España, este artículo te proporcionará toda la información necesaria sobre <strong>${topic}</strong>. La migración es un proceso complejo que requiere preparación y conocimiento de los procedimientos legales.</p>

      <h2>Requisitos Principales</h2>
      <ul>
        <li>Pasaporte colombiano vigente</li>
        <li>Documentos de identidad apostillados</li>
        <li>Prueba de medios económicos</li>
        <li>Seguro médico internacional</li>
      </ul>

      <h2>Procedimiento Paso a Paso</h2>
      <ol>
        <li><strong>Preparación de documentos:</strong> Reúne todos los documentos necesarios y asegúrate de que estén debidamente apostillados.</li>
        <li><strong>Solicitud de visa:</strong> Presenta tu solicitud en el consulado español correspondiente.</li>
        <li><strong>Entrevista consular:</strong> Prepárate para la entrevista y lleva toda la documentación requerida.</li>
        <li><strong>Llegada a España:</strong> Una vez aprobada, organiza tu viaje y primeros pasos en territorio español.</li>
      </ol>

      <h2>Consejos Importantes</h2>
      <p>Es fundamental mantenerse actualizado con los cambios en la legislación migratoria española. Te recomendamos consultar regularmente el sitio web del Ministerio de Asuntos Exteriores de España y mantener contacto con el consulado.</p>

      <blockquote>
        <p>"La preparación adecuada es clave para un proceso migratorio exitoso. No dejes nada al azar y busca siempre información oficial actualizada."</p>
      </blockquote>

      <h2>Recursos Útiles</h2>
      <ul>
        <li>Consulado de España en Colombia</li>
        <li>Ministerio de Asuntos Exteriores de España</li>
        <li>Oficinas de extranjería en España</li>
        <li>Asociaciones de colombianos en España</li>
      </ul>

      <h2>Conclusión</h2>
      <p>El proceso de migración requiere paciencia y organización, pero con la información correcta y una buena preparación, es completamente factible. Esperamos que esta guía te sea de utilidad en tu proceso migratorio.</p>
    `;
  }

  private generateExcerpt(content: string): string {
    // Extract first paragraph or create a summary
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const firstSentences = text.split('.').slice(0, 2).join('.') + '.';
    
    if (firstSentences.length > 200) {
      return firstSentences.substring(0, 197) + '...';
    }
    
    return firstSentences;
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
    const { topic, category, tone = 'informative', length = 'medium' } = body;

    const aiService = new BlogAIService();
    const generatedContent = await aiService.generateContent({ topic, category, tone, length });

    return NextResponse.json(generatedContent);

  } catch (error) {
    console.error('Error generating blog content:', error);
    return NextResponse.json(
      { error: 'Error generating content' },
      { status: 500 }
    );
  }
}