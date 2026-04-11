import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutoPageClient from '@/components/ProdutoPageClient'

export default async function Page({
  params,
}: {
  params: Promise<{ colecao: string; slug: string }>
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

  if (!produto) redirect('/categorias/todos-produtos')

  return <ProdutoPageClient produto={produto as any} />
}
