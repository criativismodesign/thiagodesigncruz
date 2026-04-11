import { prisma } from '@/lib/prisma'
import { gerarUrlProduto } from '@/lib/produto-url'
import ProdutosRelacionadosSection from './ProdutosRelacionadosSection'
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
  
  let camisetasData: any[] = []
  let mousepadsData: any[] = []
  
  try {
    // Busca separada para garantir quantidades específicas
    const [camisetasBusca, mousepadsBusca] = await Promise.all([
      // Buscar 4 camisetas (mesma coleção OU mesmo tipo)
      prisma.produto.findMany({
        where: {
          id: { not: produtoId },
          tipo: 'camiseta',
          status: 'ativo',
          OR: [
            { colecaoId: colecaoId || undefined },
            { tipo: 'camiseta' }
          ]
        },
        include: { 
          imagens: { orderBy: { ordem: 'asc' } },
          colecao: true
        },
        orderBy: { ordemSecao: 'asc' },
        take: 4
      }),
      // Buscar 3 mousepads (mesma coleção OU mesmo tipo)
      prisma.produto.findMany({
        where: {
          id: { not: produtoId },
          tipo: 'mousepad',
          status: 'ativo',
          OR: [
            { colecaoId: colecaoId || undefined },
            { tipo: 'mousepad' }
          ]
        },
        include: { 
          imagens: { orderBy: { ordem: 'asc' } },
          colecao: true
        },
        orderBy: { ordemSecao: 'asc' },
        take: 3
      })
    ])

    camisetasData = camisetasBusca
    mousepadsData = mousepadsBusca

    // Formatar camisetas
    const camisetas = camisetasData.map((p: any) => ({
      id: p.id,
      image: p.imagens.find((i: any) => i.isPrincipal)?.url || 
             p.imagens[0]?.url || 
             '/images/products/placeholder-430x575.jpg',
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
      name: p.nome,
      price: p.precoAtual,
      originalPrice: p.precoDe,
      discount: p.precoDe ? Math.round((1 - p.precoAtual / p.precoDe) * 100) : null,
      href: gerarUrlProduto({
        slug: p.slug || '',
        tipo: p.tipo,
        categoria: p.categoria,
        colecao: p.colecao
      })
    }))

    // Formatar mousepads
    const mousepads = mousepadsData.map((p: any) => ({
      id: p.id,
      image: p.imagens.find((i: any) => i.isPrincipal)?.url || 
             p.imagens[0]?.url || 
             '/images/products/placeholder-mousepad-600x290.jpg',
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
      name: p.nome,
      price: p.precoAtual,
      originalPrice: p.precoDe,
      discount: p.precoDe ? Math.round((1 - p.precoAtual / p.precoDe) * 100) : null,
      href: gerarUrlProduto({
        slug: p.slug || '',
        tipo: p.tipo,
        categoria: p.categoria,
        colecao: p.colecao
      })
    }))

    // Combinar arrays para o componente
    const produtosFormatados = [...camisetas, ...mousepads]

    if (produtosFormatados.length === 0) return null

    return <ProdutosRelacionadosSection produtos={produtosFormatados} />

  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error)
    return null
  }
}
