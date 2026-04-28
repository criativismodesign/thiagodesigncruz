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
        colecaoId: { not: null },
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
  const produtosComHref = produtos.map(p => {
    // Debug para verificar dados
    console.log('Mousepad data:', {
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      tipo: p.tipo,
      categoria: p.categoria,
      colecaoId: p.colecaoId,
      colecao: p.colecao
    })
    
    return {
      ...p,
      href: gerarUrlProduto({
        slug: p.slug || p.id, // Fallback para ID se slug for nulo
        tipo: p.tipo,
        categoria: p.categoria || 'avulso', // Fallback para avulso
        colecao: p.colecao
      })
    }
  })

  return <MousepadCollectionSection produtos={produtosComHref} />
}
