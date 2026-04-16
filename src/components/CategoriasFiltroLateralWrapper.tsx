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

    const bannerMousepad = await prisma.bannerConfig.findUnique({ 
      where: { chave: 'banner-lateral-mousepads' } 
    })
    bannerLateralMousepad = bannerMousepad?.imagem || ''
  } catch (error) {
    colecoes = []
    bannerLateral = ''
    bannerLateralMousepad = ''
  }
  return <CategoriasFiltroLateral colecoes={colecoes} bannerLateral={bannerLateral} bannerLateralMousepad={bannerLateralMousepad} chaveBanner={chaveBanner} />
}
