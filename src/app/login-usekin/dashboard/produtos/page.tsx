import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ProdutosClient from './ProdutosClient'

const prisma = new PrismaClient()

export default async function ProdutosPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  let produtos = []
  try {
    produtos = await prisma.produto.findMany({
      orderBy: { criadoEm: 'desc' }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    produtos = []
  }

  return <ProdutosClient produtosIniciais={produtos} />
}
