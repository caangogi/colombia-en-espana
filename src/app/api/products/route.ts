import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'package' | 'service' | undefined

    const products = await storage.getProducts(type)
    
    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching products' 
      },
      { status: 500 }
    )
  }
}

// POST method for admin to create products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      type,
      description,
      priceEur,
      priceCop,
      features,
      isPopular = false,
      category,
      unit = 'once',
      sortOrder = 0,
      stripeProductId,
      stripePriceId
    } = body

    if (!name || !slug || !type || !description || !priceEur || !priceCop) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      )
    }

    const newProduct = await storage.createProduct({
      name,
      slug,
      type,
      description,
      priceEur: priceEur.toString(),
      priceCop: priceCop.toString(),
      features: features || [],
      isPopular,
      category,
      unit,
      sortOrder,
      stripeProductId,
      stripePriceId
    })

    return NextResponse.json({
      success: true,
      data: newProduct
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error creating product' 
      },
      { status: 500 }
    )
  }
}