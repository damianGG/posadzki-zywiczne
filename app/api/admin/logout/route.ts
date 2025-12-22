import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_auth')
    
    return NextResponse.redirect(new URL('/admin/zamowienia', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
