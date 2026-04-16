import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BannersCategoriaClient from './BannersCategoriaClient'

export default async function BannersCategoriaPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const banners: any[] = await prisma.bannerConfig.findMany()
  const bannerMap: Record<string, string> = {}
  const linkMap: Record<string, string> = {}
  
  banners.forEach(b => {
    bannerMap[b.chave] = b.imagem || ''
    linkMap[b.chave] = b.link || ''
  })

  return <BannersCategoriaClient banners={bannerMap} links={linkMap} />
}
