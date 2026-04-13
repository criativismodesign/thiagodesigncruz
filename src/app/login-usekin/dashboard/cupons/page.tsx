import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CuponsClient from './CuponsClient'

export default async function CuponsPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  let cupons: any[] = []
  try {
    cupons = await (prisma as any).cupom.findMany({ orderBy: { criadoEm: 'desc' } })
  } catch (error) {
    console.error('Erro ao buscar cupons:', error)
    cupons = []
  }
  return <CuponsClient cupons={cupons} />
}
