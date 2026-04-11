import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ProdutoColecaoMousepadPage({
  params,
}: {
  params: Promise<{ colecao: string; slug: string }>
}) {
  const { colecao, slug } = await params
  
  const produto = await prisma.produto.findFirst({
    where: { 
      slug,
      tipo: 'mousepad',
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
      <p>Mousepad da coleção {colecao} - {produto.slug}</p>
      <p>Preço: R$ {produto.precoAtual}</p>
    </div>
  )
}
