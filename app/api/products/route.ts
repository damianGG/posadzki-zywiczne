import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sku = searchParams.get('sku')

    if (sku) {
      // Get product by SKU
      const product = await prisma.productKit.findUnique({
        where: { sku },
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(product)
    } else {
      // Get all products
      const products = await prisma.productKit.findMany({
        orderBy: { bucket: 'asc' },
      })

      return NextResponse.json(products)
    }
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    )
  }
}
