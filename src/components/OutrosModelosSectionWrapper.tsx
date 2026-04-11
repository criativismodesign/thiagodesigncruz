import { prisma } from '@/lib/prisma'
import { gerarUrlProduto } from '@/lib/produto-url'
import OutrosModelosSection from './OutrosModelosSection'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function OutrosModelosSectionWrapper() {
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        categoria: 'avulso',
        status: 'ativo',
      },
      include: { 
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true
      },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar outros modelos:', error)
    produtos = []
  }

  // Se não tiver produtos avulsos não renderiza nada
  if (produtos.length === 0) return null

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

  return <OutrosModelosSection produtos={produtosComHref} />
}
