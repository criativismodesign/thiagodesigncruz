import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import CategoriasLadoDireito from './CategoriasLadoDireito'

interface Props {
  tipo?: string        // 'camiseta' | 'mousepad'
  categoria?: string   // 'avulso' | 'colecao'
  colecaoSlug?: string // slug da coleção específica
}

export default async function CategoriasLadoDireitoWrapper({ tipo, categoria, colecaoSlug }: Props) {
  noStore()

  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        status: 'ativo',
        ...(tipo ? { tipo } : {}),
        ...(categoria ? { categoria } : {}),
        ...(colecaoSlug ? { colecao: { slug: colecaoSlug } } : {}),
      },
      include: {
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true,
      },
      orderBy: { ordemSecao: 'asc' },
    })
  } catch (error) {
    console.error('Erro ao buscar produtos categoria:', error)
    produtos = []
  }

  return <CategoriasLadoDireito produtos={produtos} />
}
