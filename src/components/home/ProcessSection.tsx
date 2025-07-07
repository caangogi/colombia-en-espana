'use client'

// Iconos SVG para cada paso del proceso
const DocumentCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    <path d="M10.05,16.94L8.22,15.11L9.63,13.7L10.05,14.12L14.37,9.8L15.78,11.21L10.05,16.94Z"/>
  </svg>
)

const AirplaneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.56,3.44C21.15,4.03 21.15,4.97 20.56,5.56L5.56,20.56C4.97,21.15 4.03,21.15 3.44,20.56C2.85,19.97 2.85,19.03 3.44,18.44L18.44,3.44C19.03,2.85 19.97,2.85 20.56,3.44M14.5,6L16.5,4H20V7.5L18,9.5L14.5,6M10,10.5L4,16.5L7.5,20L13.5,14L10,10.5Z"/>
  </svg>
)

const ScaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M10,9A5,5 0 0,0 5,14V17H7V14A3,3 0 0,1 10,11V13H14V11A3,3 0 0,1 17,14V17H19V14A5,5 0 0,0 14,9H10Z"/>
  </svg>
)

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
  </svg>
)

const AccountGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25Z"/>
  </svg>
)

export default function ProcessSection() {
  const steps = [
    {
      number: 1,
      icon: DocumentCheckIcon,
      title: "Preparación en tu país",
      description: "Documentos, apostillas y requisitos previos",
      color: "bg-colombian-yellow text-white",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      number: 2,
      icon: AirplaneIcon,
      title: "Llegada a España",
      description: "Recibimiento y primeros pasos",
      color: "bg-orange-500 text-white",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      number: 3,
      icon: ScaleIcon,
      title: "Trámites legales",
      description: "NIE, TIE y documentación oficial",
      color: "bg-colombian-red text-white",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      number: 4,
      icon: HomeIcon,
      title: "Vivienda y alojamiento",
      description: "Encontrar tu hogar en España",
      color: "bg-green-600 text-white",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      number: 5,
      icon: AccountGroupIcon,
      title: "Integración y comunidad",
      description: "Conectar con la comunidad colombiana",
      color: "bg-colombian-blue text-white",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-colombian-blue mb-4">
            Proceso Paso a Paso
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Te acompañamos en cada etapa de tu proceso migratorio
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea conectora para desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Número del paso para mobile */}
                <div className="lg:hidden absolute -top-4 -right-4 w-8 h-8 bg-colombian-blue text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                  {step.number}
                </div>

                {/* Círculo con icono */}
                <div className={`relative w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg z-20`}>
                  <step.icon className="w-10 h-10" />
                  
                  {/* Número para desktop */}
                  <div className="hidden lg:block absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                    {step.number}
                  </div>
                </div>

                {/* Contenido */}
                <div className={`${step.bgColor} ${step.borderColor} border rounded-lg p-6 shadow-sm`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿Listo para comenzar tu proceso migratorio?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-colombian-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Agenda tu consulta
            </button>
            <button className="border border-colombian-blue text-colombian-blue hover:bg-colombian-blue hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Descargar guía gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}