import { prisma } from '@/lib/prisma'
import CollectionsSection from './CollectionsSection'

export const revalidate = 60 // revalida a cada 60 segundos

export default async function CollectionsSectionWrapper() {
  
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
