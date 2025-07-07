import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔍 Test endpoint received data:', JSON.stringify(body, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: body
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error in test endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en test endpoint',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}