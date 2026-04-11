import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutoPageClient from '@/components/ProdutoPageClient'

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
  
  return <ProdutoPageClient produto={produto as any} />
}
