import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import EditarProdutoClient from './EditarProdutoClient'

const prisma = new PrismaClient()

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { imagens: true, estoque: true }
  })

  if (!produto) redirect('/login-usekin/dashboard/produtos')

  const colecoes: any[] = await prisma.colecao.findMany({
    orderBy: { nome: 'asc' }
  })

  return <EditarProdutoClient produto={produto} colecoes={colecoes} />
}
