import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutosLista from './ProdutosLista'

export default async function ProdutosPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        nome: true,
        tipo: true,
        categoria: true,
        precoAtual: true,
        status: true,
        sku: true,
        colecao: { select: { nome: true } },
        imagens: { where: { isPrincipal: true }, take: 1, select: { url: true } }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    produtos = []
  }

  return <ProdutosLista produtos={produtos} />
}
