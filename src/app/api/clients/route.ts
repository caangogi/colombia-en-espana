import { NextRequest, NextResponse } from 'next/server'
import { 
  clientService, 
  type ClientRecord, 
  clientRecordSchema 
} from '@/lib/firestore-services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📋 Saving client data:', {
      name: body.name,
      email: body.email,
      serviceType: body.serviceInfo?.type,
      serviceName: body.serviceInfo?.serviceName,
      paymentStatus: body.paymentInfo?.status
    })

    // Validate the client data
    const validatedData = clientRecordSchema.parse({
      ...body,
      createdAt: new Date().toISOString(),
      status: 'active'
    })

    // Save to Firestore
    const clientId = await clientService.create(validatedData)
    
    console.log('✅ Client data saved successfully with ID:', clientId)

    return NextResponse.json({
      success: true,
      clientId,
      message: 'Client data saved successfully'
    })

  } catch (error) {
    console.error('❌ Error saving client data:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save client data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    console.log('📋 Fetching clients with limit:', limit)
    
    const clients = await clientService.getAll(limit)
    
    return NextResponse.json({
      success: true,
      clients,
      count: clients.length
    })

  } catch (error) {
    console.error('❌ Error fetching clients:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch clients',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}