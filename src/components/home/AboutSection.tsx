'use client'

import { Button } from '@/components/ui/button-simple'

// Iconos simples en SVG
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11A1,1 0 0,1 14,12H13V16H11V12H10A1,1 0 0,1 9,11V10.5C9,8.6 10.6,7 12,7Z"/>
  </svg>
)

const HandHelpingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7L8,5H16L18,7V16.17C19.17,16.58 20,17.69 20,19A3,3 0 0,1 17,22A3,3 0 0,1 14,19C14,17.76 14.75,16.7 15.82,16.24C15.46,15.35 14.36,14 11,14H13Z"/>
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
  </svg>
)

export default function AboutSection() {
  const values = [
    {
      icon: HeartIcon,
      title: "Calidad",
      color: "bg-colombian-yellow text-white",
      description: "Servicio de excelencia en cada proceso"
    },
    {
      icon: ShieldIcon,
      title: "Confianza", 
      color: "bg-colombian-blue text-white",
      description: "Tu tranquilidad es nuestra prioridad"
    },
    {
      icon: HandHelpingIcon,
      title: "Acompañamiento",
      color: "bg-colombian-red text-white", 
      description: "Contigo en cada paso del camino"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-colombian-blue mb-4">
            Quiénes Somos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">
                Jennifer Mendoza - <span className="text-colombian-red">Tu guía de confianza</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Soy colombiana y viví la experiencia de migrar a España. Conozco cada paso, 
                cada dificultad y cada alegría del proceso.
              </p>
            </div>

            {/* Valores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${value.color} flex items-center justify-center mx-auto mb-3`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video de Jennifer */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-colombian-yellow/20 to-colombian-blue/20">
                  <Button className="bg-colombian-red hover:bg-colombian-red/90 text-white rounded-full w-16 h-16 p-0">
                    <PlayIcon className="w-8 h-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 text-white px-3 py-1 rounded text-sm">
                    Video de Jennifer
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Conoce mi historia de migración
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}