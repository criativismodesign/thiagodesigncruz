import { prisma } from '@/lib/prisma'
import HeroCarousel from './HeroCarousel'
import { unstable_noStore as noStore } from 'next/cache'

export default async function HeroCarouselWrapper() {
  noStore() // Desabilita cache - sempre busca dados frescos
  
  let slides: any[] = []
  try {
    slides = await prisma.heroBanner.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    slides = []
  }

  return <HeroCarousel slides={slides} />
}
