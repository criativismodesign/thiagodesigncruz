import { PrismaClient } from '@prisma/client'
import OriginalCollectionSection from './OriginalCollectionSection'
import { unstable_noStore as noStore } from 'next/cache'

const prisma = new PrismaClient()

export default async function OriginalCollectionSectionWrapper() {
  noStore()
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        tipo: 'camiseta',
        categoria: 'colecao',
        status: 'ativo',
        colecao: { nome: { contains: 'MY LIFE', mode: 'insensitive' } }
      },
      include: { imagens: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos My Life My Style:', error)
    produtos = []
  }

  return <OriginalCollectionSection produtos={produtos} />
}
