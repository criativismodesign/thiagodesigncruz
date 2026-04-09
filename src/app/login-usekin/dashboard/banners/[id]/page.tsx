import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import EditarBannerClient from './EditarBannerClient'

const prisma = new PrismaClient()

export default async function EditarBannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  const banner = await prisma.heroBanner.findUnique({ where: { id } })
  if (!banner) redirect('/login-usekin/dashboard/banners')
  return <EditarBannerClient banner={banner} />
}
