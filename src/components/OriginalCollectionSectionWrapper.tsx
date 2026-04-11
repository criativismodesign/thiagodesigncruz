import { prisma } from '@/lib/prisma'
import OriginalCollectionSection from './OriginalCollectionSection'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function OriginalCollectionSectionWrapper() {
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        tipo: 'camiseta',
        categoria: 'colecao',
        status: 'ativo',
        colecao: { nome: { contains: 'MY LIFE', mode: 'insensitive' } }
      },
      include: { 
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true
      },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos My Life My Style:', error)
    produtos = []
  }

  return <OriginalCollectionSection produtos={produtos} />
}
