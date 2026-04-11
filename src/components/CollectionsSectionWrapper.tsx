import { prisma } from '@/lib/prisma'
import CollectionsSection from './CollectionsSection'
import { unstable_noStore as noStore } from 'next/cache'

export default async function CollectionsSectionWrapper() {
  noStore()
  
  let colecoes: any[] = []
  try {
    colecoes = await prisma.colecao.findMany({
      where: { 
        status: 'ativa',
        visivelHome: true 
      },
      orderBy: { ordemHome: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar coleções:', error)
    colecoes = []
  }

  return <CollectionsSection colecoes={colecoes} />
}
