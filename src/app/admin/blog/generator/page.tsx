'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Sparkles, 
  Lightbulb, 
  MessageSquare,
  Bot,
  Send,
  Loader2,
  Zap,
  Brain,
  TrendingUp,
  Globe,
  Copy,
  CheckCircle,
  X
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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

const categories = [
  'Trámites y Documentación',
  'Vida Práctica', 
  'Trabajo y Empleo',
  'Cultura y Sociedad',
  'Finanzas',
  'Salud y Bienestar',
  'Educación',
  'Vivienda',
  'Noticias y Actualidad'
];

const tones = [
  { value: 'informative', label: 'Informativo y Claro' },
  { value: 'friendly', label: 'Cercano y Amigable' },
  { value: 'formal', label: 'Formal y Profesional' }
];

const lengths = [
  { value: 'short', label: 'Corto (500-800 palabras)' },
  { value: 'medium', label: 'Medio (800-1200 palabras)' },
  { value: 'long', label: 'Largo (1200-2000 palabras)' }
];

export default function BlogGenerator() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedBlogContent | null>(null);
  
  // Generator form state
  const [formData, setFormData] = useState<BlogGenerationRequest>({
    topic: '',
    category: '',
    tone: 'informative',
    length: 'medium'
  });

  // Ideas state
  const [ideaCategory, setIdeaCategory] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !userProfile || userProfile.role !== 'admin')) {
      router.push('/login');
      return;
    }
  }, [user, userProfile, loading, router]);

  const handleGenerate = async () => {
    if (!formData.topic || !formData.category) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating blog content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const response = await fetch('/api/admin/blog-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: ideaCategory })
      });

      if (response.ok) {
        const ideas = await response.json();
        setGeneratedIdeas(ideas);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatting(true);

    try {
      const response = await fetch('/api/admin/blog-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...chatMessages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (response.ok) {
        const aiResponse = await response.json();
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsChatting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/blog')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Blog
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Generador de Contenido con IA
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Usa inteligencia artificial para crear contenido de blog actualizado con búsqueda en internet
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generador Rápido
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Ideas de Contenido
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Interactivo
            </TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Parámetros de Generación
                  </CardTitle>
                  <CardDescription>
                    Configura los detalles para generar tu artículo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tema del Artículo *
                    </label>
                    <Textarea
                      placeholder="Ej: Cómo obtener la nacionalidad española siendo colombiano"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Categoría *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tono
                      </label>
                      <Select
                        value={formData.tone}
                        onValueChange={(value: any) => setFormData({ ...formData, tone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map(tone => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Extensión
                    </label>
                    <Select
                      value={formData.length}
                      onValueChange={(value: any) => setFormData({ ...formData, length: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map(length => (
                          <SelectItem key={length.value} value={length.value}>
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Generación Inteligente</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      La IA buscará información actualizada en internet y generará contenido específico para colombianos en España, incluyendo referencias a normativas recientes y recursos oficiales.
                    </p>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={!formData.topic || !formData.category || isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generando Artículo Completo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generar Artículo Completo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa del Contenido</CardTitle>
                  <CardDescription>
                    El contenido generado aparecerá aquí
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{generatedContent.title}</h3>
                        <Badge variant="outline">{generatedContent.category}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Extracto:</h4>
                        <p className="text-sm text-gray-600">{generatedContent.excerpt}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Contenido:</h4>
                        <ScrollArea className="h-64 border rounded p-3">
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                          />
                        </ScrollArea>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyToClipboard(generatedContent.content)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Contenido
                        </Button>
                        <Button 
                          onClick={() => router.push(`/admin/blog/new?generated=true`)}
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Usar en Editor
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Bot className="h-16 w-16 mx-auto mb-4" />
                      <p>Completa el formulario y genera contenido para ver la vista previa</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Ideas de Artículos
                </CardTitle>
                <CardDescription>
                  Las ideas se generan basándose en temas actuales y relevantes para la comunidad colombiana en España.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Select
                      value={ideaCategory}
                      onValueChange={setIdeaCategory}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecciona una categoría (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las categorías</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleGenerateIdeas}
                      disabled={isGeneratingIdeas}
                    >
                      {isGeneratingIdeas ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Generar Ideas
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Ideas Inteligentes</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Las ideas se generan basándose en temas actuales y relevantes para la comunidad colombiana en España. Selecciona una idea y luego ve a "Generador Rápido" para crear el contenido completo.
                    </p>
                  </div>

                  {generatedIdeas.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Ideas Generadas:</h4>
                      {generatedIdeas.map((idea, index) => (
                        <Card key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <p className="flex-1">{idea}</p>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setFormData({ ...formData, topic: idea });
                                setActiveTab('generator');
                              }}
                            >
                              Usar Idea
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Chat Interactivo con IA
                </CardTitle>
                <CardDescription>
                  Conversa directamente con la IA especializada para crear contenido personalizado, hacer preguntas específicas y obtener respuestas detalladas sobre migración a España.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Conversación Natural</p>
                      <p className="text-xs text-purple-500">Haz preguntas como si hablaras con un experto en migración</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Búsqueda en Tiempo Real</p>
                      <p className="text-xs text-blue-500">Obtén información actualizada de fuentes oficiales</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 border rounded-lg p-4 mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Bot className="h-16 w-16 mx-auto mb-4" />
                      <p className="mb-2">¡Hola! Soy tu asistente de IA especializado en migración colombiana a España.</p>
                      <p>Pregúntame cualquier cosa sobre trámites, vida práctica, trabajo, o cualquier tema relacionado.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message, index) => (
                        <div 
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe tu pregunta o solicitud..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
                    disabled={isChatting}
                  />
                  <Button 
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || isChatting}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-sm font-medium text-green-600">🗣️ Generación de Contenido</p>
                    <p className="text-xs text-green-500">Convierte las respuestas en artículos de blog automáticamente</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-sm font-medium text-orange-600">🧠 Especialización</p>
                    <p className="text-xs text-orange-500">IA entrenada específicamente para temas de migración colombiana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}