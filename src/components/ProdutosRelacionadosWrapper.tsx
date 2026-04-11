import { prisma } from '@/lib/prisma'
import ProdutosRelacionados from './ProdutosRelacionados'
import { unstable_noStore as noStore } from 'next/cache'

export default async function ProdutosRelacionadosWrapper({ 
  produtoId, 
  tipo,
  colecaoId 
}: { 
  produtoId: string
  tipo: string
  colecaoId: string | null 
}) {
  noStore()
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        id: { not: produtoId },
        status: 'ativo',
        OR: [
          { colecaoId: colecaoId || undefined },
          { tipo }
        ]
      },
      include: { imagens: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordemSecao: 'asc' },
      take: 8,
    })
  } catch (error) {
    produtos = []
  }

  if (produtos.length === 0) return null

  return <ProdutosRelacionados produtos={produtos} />
}
