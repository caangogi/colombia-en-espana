'use client'

import FirebaseTest from '@/components/FirebaseTest'

export default function FirebaseTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico Firebase</h1>
          <p className="text-gray-600">
            Verifica que Firebase esté configurado correctamente antes de continuar
          </p>
        </div>
        
        <FirebaseTest />
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Si todos los tests pasan, el sistema de roles funcionará correctamente.
          </p>
          <p className="mt-2">
            <strong>Accede a:</strong> <code>/signup</code> para crear tu primera cuenta
          </p>
        </div>
      </div>
    </div>
  )
}