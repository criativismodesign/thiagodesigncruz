import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import PedidosClient from './PedidosClient'

export default async function PedidosPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const pedidos: any[] = await (prisma as any).order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { produto: { select: { nome: true } } } }
    }
  })

  return <PedidosClient pedidos={pedidos} />
}
