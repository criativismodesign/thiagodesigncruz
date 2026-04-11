import { prisma } from '@/lib/prisma'
import ImmortalsCollectionSection from './ImmortalsCollectionSection'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function ImmortalsCollectionSectionWrapper() {
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        tipo: 'camiseta',
        categoria: 'colecao',
        status: 'ativo',
        colecao: { nome: { contains: 'IMMORTAL', mode: 'insensitive' } }
      },
      include: { imagens: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos Immortals:', error)
    produtos = []
  }

  return <ImmortalsCollectionSection produtos={produtos} />
}
