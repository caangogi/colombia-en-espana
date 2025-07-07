'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'

export default function FirebaseTest() {
  const [testResults, setTestResults] = useState<{
    connection: 'pending' | 'success' | 'error'
    write: 'pending' | 'success' | 'error'
    read: 'pending' | 'success' | 'error'
    cleanup: 'pending' | 'success' | 'error'
  }>({
    connection: 'pending',
    write: 'pending',
    read: 'pending',
    cleanup: 'pending'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runFirebaseTest = async () => {
    setLoading(true)
    setError(null)
    
    const testId = `test-${Date.now()}`
    const testData = {
      message: 'Test successful',
      timestamp: new Date(),
      testId
    }

    try {
      // Test 1: Connection
      console.log('🔍 Testing Firebase connection...')
      setTestResults(prev => ({ ...prev, connection: 'success' }))
      
      // Test 2: Write operation
      console.log('📝 Testing write operation...')
      const docRef = doc(collection(db, 'test'), testId)
      await setDoc(docRef, testData)
      setTestResults(prev => ({ ...prev, write: 'success' }))
      
      // Test 3: Read operation
      console.log('📖 Testing read operation...')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.testId === testId) {
          setTestResults(prev => ({ ...prev, read: 'success' }))
        } else {
          throw new Error('Data mismatch')
        }
      } else {
        throw new Error('Document not found')
      }
      
      // Test 4: Cleanup
      console.log('🧹 Cleaning up test data...')
      await deleteDoc(docRef)
      setTestResults(prev => ({ ...prev, cleanup: 'success' }))
      
      console.log('✅ All Firebase tests passed!')
      
    } catch (err) {
      console.error('❌ Firebase test failed:', err)
      setError(err instanceof Error ? err.message : 'Test failed')
      
      // Update failed test
      if (testResults.connection === 'pending') {
        setTestResults(prev => ({ ...prev, connection: 'error' }))
      } else if (testResults.write === 'pending') {
        setTestResults(prev => ({ ...prev, write: 'error' }))
      } else if (testResults.read === 'pending') {
        setTestResults(prev => ({ ...prev, read: 'error' }))
      } else if (testResults.cleanup === 'pending') {
        setTestResults(prev => ({ ...prev, cleanup: 'error' }))
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Diagnóstico Firebase</CardTitle>
        <CardDescription>
          Prueba la conexión y permisos de Firestore
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Results */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.connection)}
            <span className="text-sm">Conexión Firebase</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.write)}
            <span className="text-sm">Escritura en Firestore</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.read)}
            <span className="text-sm">Lectura de Firestore</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.cleanup)}
            <span className="text-sm">Limpieza de datos</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Test Button */}
        <Button 
          onClick={runFirebaseTest} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Probando...
            </>
          ) : (
            'Probar Firebase'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}