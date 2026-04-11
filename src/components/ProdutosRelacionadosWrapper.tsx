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
  
  let produtos: any[] = []
  try {
    // Buscar produtos relacionados (mesma coleção ou mesmo tipo)
    produtos = await prisma.produto.findMany({
      where: {
        id: { not: produtoId },
        status: 'ativo',
        OR: [
          { colecaoId: colecaoId || undefined },
          { tipo }
        ]
      },
      include: { 
        imagens: { orderBy: { ordem: 'asc' } },
        colecao: true
      },
      orderBy: { ordemSecao: 'asc' },
      take: 7, // Buscar até 7 para garantir 4 camisetas + 3 mousepads
    })

    // Separar e limitar: 4 camisetas + 3 mousepads
    const camisetas = produtos
      .filter((p: any) => p.tipo === 'camiseta')
      .slice(0, 4)
      .map((p: any) => ({
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

    const mousepads = produtos
      .filter((p: any) => p.tipo === 'mousepad')
      .slice(0, 3)
      .map((p: any) => ({
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
