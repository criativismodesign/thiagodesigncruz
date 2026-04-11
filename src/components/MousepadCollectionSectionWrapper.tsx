import { PrismaClient } from '@prisma/client'
import MousepadCollectionSection from './MousepadCollectionSection'
import { unstable_noStore as noStore } from 'next/cache'

const prisma = new PrismaClient()

export default async function MousepadCollectionSectionWrapper() {
  noStore()
  
  let produtos: any[] = []
  try {
    produtos = await prisma.produto.findMany({
      where: {
        tipo: 'mousepad',
        status: 'ativo',
      },
      include: { imagens: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordemSecao: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar mousepads:', error)
    produtos = []
  }

  return <MousepadCollectionSection produtos={produtos} />
}
