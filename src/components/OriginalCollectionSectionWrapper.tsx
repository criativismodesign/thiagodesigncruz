import { prisma } from '@/lib/prisma'
import { gerarUrlProduto } from '@/lib/produto-url'
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

  // Mapear produtos com href correto usando slug
  const produtosComHref = produtos.map(p => ({
    ...p,
    href: gerarUrlProduto({
      slug: p.slug || '',
      tipo: p.tipo,
      categoria: p.categoria,
      colecao: p.colecao
    })
  }))

  return <OriginalCollectionSection produtos={produtosComHref} />
}
