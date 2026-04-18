import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutoPageClient from '@/components/ProdutoPageClient'
import ProdutosRelacionadosWrapper from '@/components/ProdutosRelacionadosWrapper'
import NewsletterSection from '@/components/NewsletterSection'
import BannerBoxSection from '@/components/BannerBoxSection'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; colecao: string }> }) {
  const { slug, colecao } = await params
  const produto = await prisma.produto.findFirst({
    where: { slug, tipo: 'camiseta' },
    include: { imagens: { orderBy: { ordem: 'asc' } }, colecao: true }
  })
  if (!produto) return { title: 'Produto não encontrado' }
  const imagem = produto.imagens[0]?.url || ''
  const colecaoNome = produto.colecao?.nome ? `${produto.colecao.nome} | ` : ''
  return {
    title: `${produto.nome} | Camiseta UseKIN`,
    description: produto.descricaoCurta || `Camiseta ${produto.nome} - ${colecaoNome}UseKIN. Estampa exclusiva, modelagem oversized premium. Entrega para todo o Brasil.`,
    openGraph: {
      title: `${produto.nome} | Camiseta UseKIN`,
      description: produto.descricaoCurta || `Camiseta ${produto.nome} - UseKIN`,
      images: imagem ? [{ url: imagem }] : [],
    }
  }
}

function ProdutoSchema({ produto, url }: { produto: any, url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": produto.nome,
    "description": produto.descricaoCurta || produto.descricaoLonga || '',
    "image": produto.imagens?.[0]?.url || '',
    "brand": {
      "@type": "Brand",
      "name": "UseKIN"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "BRL",
      "price": produto.precoAtual,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "UseKIN"
      }
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string; colecao?: string }>
}) {
  const { slug, colecao } = await params

  const produto = await prisma.produto.findFirst({
    where: { 
      slug,
      tipo: 'camiseta'
    },
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
      <ProdutoSchema 
        produto={produtoAdaptado} 
        url={`https://www.usekin.com.br/produto/${colecao}/camiseta/${slug}`} 
      />
      <ProdutoPageClient produto={produtoAdaptado as any} />
      <ProdutosRelacionadosWrapper 
        produtoId={produto.id}
        tipo={produto.tipo}
        colecaoId={produto.colecaoId}
      />
      <NewsletterSection source="produto" />
      <BannerBoxSection />
    </>
  )
}
