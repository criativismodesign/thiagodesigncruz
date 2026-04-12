import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import CategoriasFiltroLateral from './CategoriasFiltroLateral'

export default async function CategoriasFiltroLateralWrapper() {
  noStore()

  let colecoes: any[] = []
  try {
    colecoes = await prisma.colecao.findMany({
      where: { status: 'ativa' },
      orderBy: { ordemHome: 'asc' },
    })
  } catch (error) {
    colecoes = []
  }

  return <CategoriasFiltroLateral colecoes={colecoes} />
}
