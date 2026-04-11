import { prisma } from '@/lib/prisma'
import MousepadCollectionSection from './MousepadCollectionSection'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function MousepadCollectionSectionWrapper() {
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        tipo: 'mousepad',
        status: 'ativo',
      },
      include: { imagens: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar mousepads:', error)
    produtos = []
  }

  return <MousepadCollectionSection produtos={produtos} />
}
