import { prisma } from '@/lib/prisma'
import ImmortalsCollectionSection from './ImmortalsCollectionSection'
import { unstable_noStore as noStore } from 'next/cache'

export default async function ImmortalsCollectionSectionWrapper() {
  noStore()
  
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
