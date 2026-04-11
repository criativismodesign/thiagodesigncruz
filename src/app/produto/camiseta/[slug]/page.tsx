import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ProdutoCamisetaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const produto = await prisma.produto.findFirst({
    where: { 
      slug,
      tipo: 'camiseta',
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
      <p>Camiseta avulsa - {produto.slug}</p>
      <p>Preço: R$ {produto.precoAtual}</p>
    </div>
  )
}
