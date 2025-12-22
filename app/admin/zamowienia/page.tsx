import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { AdminLogin } from '@/components/admin-login'
import { AdminOrdersList } from '@/components/admin-orders-list'

export const metadata: Metadata = {
  title: 'Administracja - Zamówienia | Posadzki Żywiczne',
  description: 'Panel administracyjny zamówień',
}

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === process.env.ADMIN_PASSWORD
}

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          productKit: true
        }
      }
    }
  })
  return orders
}

export default async function AdminZamowieniaPage() {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Administracja - Zamówienia</h1>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Wyloguj
            </button>
          </form>
        </div>

        <AdminOrdersList orders={orders} />
      </div>
    </div>
  )
}
