import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import CategoriasFiltroLateral from './CategoriasFiltroLateral'

export default async function CategoriasFiltroLateralWrapper() {
  noStore()

  let colecoes: any[] = []
  let bannerLateral = ''
  
  try {
    colecoes = await prisma.colecao.findMany({
      where: { status: 'ativa' },
      orderBy: { ordemHome: 'asc' },
    })
    
    const banner = await prisma.bannerConfig.findUnique({ 
      where: { chave: 'banner-lateral-categorias' } 
    })
    bannerLateral = banner?.imagem || ''
  } catch (error) {
    colecoes = []
    bannerLateral = ''
  }

  return <CategoriasFiltroLateral colecoes={colecoes} bannerLateral={bannerLateral} />
}
