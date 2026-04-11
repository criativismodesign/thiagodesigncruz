import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutoPageClient from '@/components/ProdutoPageClient'
import ProdutosRelacionadosSection from '@/components/ProdutosRelacionadosSection'

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string; colecao?: string }>
}) {
  const { slug } = await params

  const produto = await prisma.produto.findFirst({
    where: { slug },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      estoque: true,
      colecao: true,
    }
  })

  if (!produto) redirect('/')

  // Adaptar dados para o formato esperado pelo ProdutoPageClient
  const produtoAdaptado = {
    id: produto.id,
    nome: produto.nome,
    tipo: produto.tipo,
    categoria: produto.categoria,
    precoAtual: produto.precoAtual,
    precoDe: produto.precoDe,
    cores: produto.estoque?.map(e => e.cor).filter((c): c is string => Boolean(c)) || [],
    descricaoCurta: produto.descricaoCurta,
    descricaoLonga: produto.descricaoLonga,
    entregaPrazo: produto.entregaPrazo,
    informacoes: produto.informacoes,
    status: produto.status,
    imagens: produto.imagens,
    estoque: produto.estoque,
    colecao: produto.colecao
  }

  return (
    <>
      <ProdutoPageClient produto={produtoAdaptado as any} />
      <ProdutosRelacionadosSection />
    </>
  )
}
