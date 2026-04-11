import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ProdutoColecaoCamisetaPage({
  params,
}: {
  params: Promise<{ colecao: string; slug: string }>
}) {
  const { colecao, slug } = await params
  
  const produto = await prisma.produto.findFirst({
    where: { 
      slug,
      tipo: 'camiseta',
      categoria: 'colecao',
      colecao: { slug: colecao }
    },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      estoque: true,
      colecao: true,
    }
  })
  
  if (!produto) redirect('/categorias/todos-produtos')
  
  // TODO: Criar ProdutoPageClient component
  return (
    <div>
      <h1>{produto.nome}</h1>
      <p>Camiseta da coleção {colecao} - {produto.slug}</p>
      <p>Preço: R$ {produto.precoAtual}</p>
    </div>
  )
}
