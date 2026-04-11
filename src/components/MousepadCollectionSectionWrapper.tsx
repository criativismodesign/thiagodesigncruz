import { prisma } from '@/lib/prisma'
import { gerarUrlProduto } from '@/lib/produto-url'
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
      include: { 
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true
      },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar mousepads:', error)
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

  return <MousepadCollectionSection produtos={produtosComHref} />
}
