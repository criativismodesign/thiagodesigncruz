import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import NovoProdutoClient from './NovoProdutoClient'

const prisma = new PrismaClient()

export default async function NovoProdutoPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const colecoes: any[] = await prisma.colecao.findMany({
    orderBy: { nome: 'asc' }
  })

  return <NovoProdutoClient colecoes={colecoes} />
}
