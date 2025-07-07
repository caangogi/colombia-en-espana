export interface BlogGenerationRequest {
  topic: string;
  category: string;
  tone: 'formal' | 'friendly' | 'informative';
  length: 'short' | 'medium' | 'long';
}

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
}

export interface ContentStructure {
  sections: Array<{
    type: string;
    title: string;
    content: string;
    order: number;
  }>;
  highlights: string[];
  callouts: Array<{
    type: string;
    content: string;
  }>;
}

class AIService {
  private perplexityApiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY!;
    if (!this.perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY environment variable is required');
    }
  }

  private createSystemPrompt(tone: string): string {
    return `Eres un experto en migración colombiana a España con amplia experiencia en trámites legales, integración cultural y vida práctica. 

INSTRUCCIONES:
- Escribe contenido específico para colombianos que desean migrar o ya viven en España
- Usa un tono ${tone === 'formal' ? 'profesional y técnico' : tone === 'friendly' ? 'cercano y amigable' : 'informativo y claro'}
- Incluye información actualizada y práctica
- Menciona recursos específicos, sitios web oficiales, y datos concretos
- Estructura el contenido con subtítulos y listas cuando sea apropiado
- Enfócate en experiencias reales y consejos prácticos
- Incluye referencias a comunidades colombianas en España cuando sea relevante

FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "title": "Título atractivo y específico",
  "excerpt": "Resumen de 2-3 líneas que capte la atención",
  "content": "Contenido completo en HTML limpio y bien estructurado",
  "highlights": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
  "structure": {
    "sections": [
      {
        "type": "header|content|highlight|callout",
        "title": "Título de la sección",
        "content": "Contenido HTML",
        "order": 1
      }
    ],
    "callouts": [
      {
        "type": "tip|warning|info|success",
        "content": "Contenido del callout"
      }
    ]
  }
}`;
  }

  private createUserPrompt(topic: string, category: string, length: string): string {
    const lengthGuide = {
      'short': '800-1200 palabras, 3-4 secciones principales',
      'medium': '1500-2000 palabras, 5-6 secciones principales',
      'long': '2500-3000 palabras, 7-8 secciones principales con subsecciones'
    };

    return `Genera un artículo de blog sobre "${topic}" en la categoría "${category}".

ESPECIFICACIONES:
- Longitud: ${lengthGuide[length as keyof typeof lengthGuide]}
- Debe incluir información actualizada de 2024-2025
- Busca datos específicos y referencias oficiales
- Incluye experiencias reales de colombianos en España
- Agrega consejos prácticos y recursos útiles

CATEGORÍAS DE REFERENCIA:
- Trámites y Documentación: NIE, TIE, homologaciones, etc.
- Vida Práctica: vivienda, trabajo, educación, salud
- Integración Cultural: costumbres, festividades, comunidades
- Trabajo y Emprendimiento: oportunidades laborales, emprender
- Educación y Formación: universidades, cursos, reconocimientos
- Salud y Bienestar: sistema sanitario, seguros, cuidados
- Viajes y Turismo: conocer España, destinos, consejos
- Tecnología y Digital: servicios online, apps útiles, trámites digitales
- Finanzas Personales: bancos, impuestos, inversiones

Busca información actual y específica para crear contenido valioso y práctico.`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private convertMarkdownToHTML(markdown: string): string {
    return markdown
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\n- /g, '<li>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/p>/g, match => {
        if (match.includes('<li>')) return '</li></ul>';
        return '</p>';
      });
  }

  private cleanContentFromMetadata(content: string): string {
    const lines = content.split('\n');
    const cleanLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('---') && 
             !trimmed.startsWith('title:') && 
             !trimmed.startsWith('category:') && 
             !trimmed.startsWith('excerpt:') &&
             !trimmed.startsWith('date:') &&
             !trimmed.startsWith('author:');
    });
    
    return cleanLines.join('\n').trim();
  }

  async generateBlogContent(request: BlogGenerationRequest): Promise<GeneratedBlogContent> {
    try {
      const systemPrompt = this.createSystemPrompt(request.tone);
      const userPrompt = this.createUserPrompt(request.topic, request.category, request.length);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ["gov.es", "europa.eu", "seg-social.es", "exteriores.gob.es"],
          search_recency_filter: "month"
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      let parsedContent;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response as JSON');
      }

      const slug = this.generateSlug(parsedContent.title);
      const cleanContent = this.cleanContentFromMetadata(parsedContent.content);
      const htmlContent = this.convertMarkdownToHTML(cleanContent);

      const result: GeneratedBlogContent = {
        title: parsedContent.title,
        slug: slug,
        excerpt: parsedContent.excerpt,
        content: htmlContent,
        category: request.category,
        imageUrl: this.generateImage(request.topic, request.category)
      };

      return result;
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw new Error('Failed to generate blog content');
    }
  }

  async generateBlogIdeas(category?: string): Promise<string[]> {
    try {
      const categoryPrompt = category 
        ? `en la categoría específica de "${category}"` 
        : 'en diferentes categorías relevantes para migrantes colombianos';

      const prompt = `Genera 10 ideas específicas y atractivas para artículos de blog ${categoryPrompt} sobre migración colombiana a España.

INSTRUCCIONES:
- Ideas específicas y prácticas
- Títulos que resuelvan problemas reales
- Enfoque en información actualizada 2024-2025
- Variedad de temas dentro de la categoría
- Títulos atractivos que generen clicks

Responde ÚNICAMENTE con un array JSON de strings:
["Título 1", "Título 2", ..., "Título 10"]`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.8,
          top_p: 0.9
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      try {
        const ideas = JSON.parse(aiResponse);
        return Array.isArray(ideas) ? ideas : [];
      } catch (parseError) {
        console.error('Error parsing blog ideas:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error generating blog ideas:', error);
      throw new Error('Failed to generate blog ideas');
    }
  }

  async chatWithAI(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      const systemMessage = {
        role: 'system',
        content: `Eres un asistente experto en migración colombiana a España. Ayudas con información práctica, trámites, vida cotidiana y integración cultural. Mantén un tono profesional pero cercano.

INSTRUCCIONES:
- Responde de manera directa y útil
- Incluye información específica y actualizada
- Menciona recursos oficiales cuando sea relevante
- Si no tienes información reciente, indícalo claramente
- Enfócate en experiencias reales de colombianos en España`
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [systemMessage, ...messages],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9,
          return_citations: true,
          search_recency_filter: "month"
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to process chat message');
    }
  }

  async generateContentStructure(content: string): Promise<ContentStructure> {
    try {
      const prompt = `Analiza el siguiente contenido y genera una estructura mejorada con secciones, highlights y callouts.

CONTENIDO:
${content}

Responde ÚNICAMENTE con un JSON válido:
{
  "sections": [
    {
      "type": "header|content|highlight",
      "title": "Título de sección",
      "content": "Contenido HTML",
      "order": 1
    }
  ],
  "highlights": ["Punto importante 1", "Punto importante 2"],
  "callouts": [
    {
      "type": "tip|warning|info|success",
      "content": "Contenido del callout"
    }
  ]
}`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.5
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Error parsing content structure:', parseError);
        return {
          sections: [],
          highlights: [],
          callouts: []
        };
      }
    } catch (error) {
      console.error('Error generating content structure:', error);
      throw new Error('Failed to generate content structure');
    }
  }

  private generateImage(topic: string, category: string): string {
    const images = {
      'Trámites y Documentación': [
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f'
      ],
      'Vida Práctica': [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
      ],
      'Trabajo y Emprendimiento': [
        'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5',
        'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
        'https://images.unsplash.com/photo-1556484687-30636164638b',
        'https://images.unsplash.com/photo-1552664730-d307ca884978'
      ],
      'default': [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d35e5d',
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
        'https://images.unsplash.com/photo-1583422409516-2895a77efded'
      ]
    };

    const categoryImages = images[category as keyof typeof images] || images.default;
    const keywords = topic.toLowerCase();

    if (keywords.includes('nie') || keywords.includes('documento')) {
      return categoryImages[1] + '?w=800&h=400&fit=crop';
    }
    if (keywords.includes('trabajo') || keywords.includes('empleo')) {
      return images['Trabajo y Emprendimiento'][0] + '?w=800&h=400&fit=crop';
    }
    if (keywords.includes('madrid') || keywords.includes('barcelona')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d35e5d?w=800&h=400&fit=crop';
    }

    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    return categoryImages[randomIndex] + '?w=800&h=400&fit=crop';
  }

  async generateContextualBlogIdeas(userProfile?: any): Promise<any> {
    try {
      const contextPrompt = userProfile 
        ? `considerando el perfil del usuario: ${JSON.stringify(userProfile)}` 
        : 'para la audiencia general de colombianos interesados en migrar a España';

      const prompt = `Genera ideas contextuale e inteligentes para artículos de blog ${contextPrompt}.

ANÁLISIS REQUERIDO:
- Tendencias actuales en migración (2024-2025)
- Estacionalidad y fechas importantes
- Gaps de contenido común
- Temas urgentes o relevantes

Responde con JSON:
{
  "trending": ["Idea trending 1", "Idea trending 2"],
  "seasonal": ["Idea estacional 1", "Idea estacional 2"],
  "urgent": ["Tema urgente 1", "Tema urgente 2"],
  "gaps": ["Gap de contenido 1", "Gap de contenido 2"]
}`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.8,
          search_recency_filter: "week"
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        return {
          trending: [],
          seasonal: [],
          urgent: [],
          gaps: []
        };
      }
    } catch (error) {
      console.error('Error generating contextual ideas:', error);
      throw new Error('Failed to generate contextual blog ideas');
    }
  }

  async analyzeContentGaps(): Promise<any> {
    try {
      const prompt = `Analiza los gaps de contenido más importantes para colombianos migrando a España en 2024-2025.

ANÁLISIS:
- Temas poco cubiertos en blogs actuales
- Información desactualizada que necesita refresh
- Nuevos trámites o cambios legislativos
- Experiencias específicas poco documentadas

Responde con JSON:
{
  "uncovered_topics": ["Tema no cubierto 1", "Tema no cubierto 2"],
  "outdated_info": ["Info desactualizada 1", "Info desactualizada 2"],
  "recent_changes": ["Cambio reciente 1", "Cambio reciente 2"],
  "user_needs": ["Necesidad no atendida 1", "Necesidad no atendida 2"]
}`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
          search_recency_filter: "month"
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        return {
          uncovered_topics: [],
          outdated_info: [],
          recent_changes: [],
          user_needs: []
        };
      }
    } catch (error) {
      console.error('Error analyzing content gaps:', error);
      throw new Error('Failed to analyze content gaps');
    }
  }
}

export const aiService = new AIService();