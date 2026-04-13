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
  const cupons: any[] = await prisma.cupom.findMany({ orderBy: { criadoEm: 'desc' } })
  return <CuponsClient cupons={cupons} />
}
