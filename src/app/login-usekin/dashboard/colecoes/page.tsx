import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ColecoesLista from './ColecoesLista'

const prisma = new PrismaClient()

export default async function ColecoesPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  const colecoes: any[] = await prisma.colecao.findMany({
    orderBy: { ordemHome: 'asc' }
  })
  return <ColecoesLista colecoes={colecoes} />
}
