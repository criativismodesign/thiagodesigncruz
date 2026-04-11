import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ProdutoMousepadPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const produto = await prisma.produto.findFirst({
    where: { 
      slug,
      tipo: 'mousepad',
      categoria: 'avulso'
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
      <p>Mousepad avulso - {produto.slug}</p>
      <p>Preço: R$ {produto.precoAtual}</p>
    </div>
  )
}
