import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import CategoriasLadoDireito from './CategoriasLadoDireito'

interface Props {
  tipo?: string
  categoria?: string
  colecaoSlug?: string
  busca?: string
}

export default async function CategoriasLadoDireitoWrapper({ tipo, categoria, colecaoSlug, busca }: Props) {
  noStore()
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        status: 'ativo',
        ...(tipo ? { tipo } : {}),
        ...(categoria ? { categoria } : {}),
        ...(colecaoSlug ? { colecao: { slug: colecaoSlug } } : {}),
        ...(busca ? { nome: { contains: busca, mode: 'insensitive' } } : {}),
      },
      include: {
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true,
        estoque: true,
      },
      orderBy: { ordemSecao: 'asc' },
    })
  } catch (error) {
    console.error('Erro ao buscar produtos categoria:', error)
    produtos = []
  }
  return <CategoriasLadoDireito produtos={produtos} busca={busca} />
}
