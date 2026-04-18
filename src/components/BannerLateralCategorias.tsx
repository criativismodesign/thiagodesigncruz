import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export default async function BannerLateralCategorias({ chaveBanner }: { chaveBanner?: string }) {
  noStore()
  let bannerLateral = ''
  let bannerLateralMousepad = ''
  let bannerLateralLink = ''
  let bannerLateralMousepadLink = ''
  
  try {
    const chave = chaveBanner || 'banner-lateral-categorias'
    const banner = await prisma.bannerConfig.findUnique({ where: { chave } })
    bannerLateral = banner?.imagem || ''
    bannerLateralLink = (banner as any)?.link || ''
    const bannerMousepad = await prisma.bannerConfig.findUnique({ where: { chave: 'banner-lateral-mousepads' } })
    bannerLateralMousepad = bannerMousepad?.imagem || ''
    bannerLateralMousepadLink = (bannerMousepad as any)?.link || ''
  } catch (error) {}

  const src = chaveBanner === 'banner-lateral-mousepads'
    ? (bannerLateralMousepad || bannerLateral || '')
    : (bannerLateral || '')

  if (!src) return null

  const href = chaveBanner === 'banner-lateral-mousepads'
    ? (bannerLateralMousepadLink || 'https://wa.me/5562981316462')
    : bannerLateralLink

  return (
    <div className="lg:hidden w-full my-10 flex justify-center px-4">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Image src={src} alt="Banner promocional" width={1200} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </a>
      ) : (
        <Image src={src} alt="Banner promocional" width={1200} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
      )}
    </div>
  )
}
