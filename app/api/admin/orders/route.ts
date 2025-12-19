import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/orders'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  const base64Credentials = authHeader.slice(6)
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')

  const adminPassword = process.env.ADMIN_PASSWORD

  return username === 'admin' && password === adminPassword
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
          },
        }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    const result = await getAllOrders(page, perPage)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Admin orders GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    )
  }
}
