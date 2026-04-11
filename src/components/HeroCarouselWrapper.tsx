import { prisma } from '@/lib/prisma'
import HeroCarousel from './HeroCarousel'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function HeroCarouselWrapper() {
  
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
