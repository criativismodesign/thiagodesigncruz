import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import BannersLista from './BannersLista'

const prisma = new PrismaClient()

export default async function BannersPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  const banners: any[] = await prisma.heroBanner.findMany({
    orderBy: { ordem: 'asc' }
  })
  return <BannersLista banners={banners} />
}
