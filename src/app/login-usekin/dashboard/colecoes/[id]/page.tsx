import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import EditarColecaoClient from './EditarColecaoClient'

const prisma = new PrismaClient()

export default async function EditarColecaoPage({
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
  const colecao = await prisma.colecao.findUnique({ where: { id } })
  if (!colecao) redirect('/login-usekin/dashboard/colecoes')
  return <EditarColecaoClient colecao={colecao} />
}
