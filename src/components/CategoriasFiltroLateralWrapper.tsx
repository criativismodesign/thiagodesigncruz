import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import CategoriasFiltroLateral from './CategoriasFiltroLateral'

interface Props {
  chaveBanner?: string
}

export default async function CategoriasFiltroLateralWrapper({ chaveBanner }: Props) {
  noStore()
  let colecoes: any[] = []
  let bannerLateral = ''
  let bannerLateralMousepad = ''
  let bannerLateralLink = ''
  let bannerLateralMousepadLink = ''
  
  try {
    colecoes = await prisma.colecao.findMany({
      where: { status: 'ativa' },
      orderBy: { ordemHome: 'asc' },
    })
    
    const chave = chaveBanner || 'banner-lateral-categorias'
    const banner = await prisma.bannerConfig.findUnique({ 
      where: { chave } 
    })
    bannerLateral = banner?.imagem || ''
    const bannerLateralLink = (banner as any)?.link || ''

    const bannerMousepad = await prisma.bannerConfig.findUnique({ 
      where: { chave: 'banner-lateral-mousepads' } 
    })
    bannerLateralMousepad = bannerMousepad?.imagem || ''
    const bannerLateralMousepadLink = (bannerMousepad as any)?.link || ''
  } catch (error) {
    colecoes = []
    bannerLateral = ''
    bannerLateralMousepad = ''
    bannerLateralLink = ''
    bannerLateralMousepadLink = ''
  }
  return <CategoriasFiltroLateral 
    colecoes={colecoes} 
    bannerLateral={bannerLateral} 
    bannerLateralMousepad={bannerLateralMousepad}
    bannerLateralLink={bannerLateralLink}
    bannerLateralMousepadLink={bannerLateralMousepadLink}
    chaveBanner={chaveBanner} 
  />
}
