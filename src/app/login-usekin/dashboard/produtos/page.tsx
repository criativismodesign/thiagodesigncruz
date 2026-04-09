import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ProdutosClient from './ProdutosClient'

const prisma = new PrismaClient()

interface Produto {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string
  categoryId: string
  type: string
  sizes: string | null
  colors: string | null
  stock: number
  featured: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export default async function ProdutosPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  let produtos: Produto[] = []
  try {
    produtos = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }

  return <ProdutosClient produtosIniciais={produtos} />
}
