import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

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

  return (
    <div>
      <h1>{produto.nome}</h1>
      <p>Página do produto em construção</p>
    </div>
  )
}
