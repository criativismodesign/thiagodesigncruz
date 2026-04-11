import { PrismaClient } from '@prisma/client'
import { gerarSlug } from '../lib/slug'

const prisma = new PrismaClient()

async function main() {
  const produtos = await prisma.produto.findMany()
  for (const p of produtos) {
    await prisma.produto.update({
      where: { id: p.id },
      data: { slug: gerarSlug(p.nome) }
    })
  }
  
  const colecoes = await prisma.colecao.findMany()
  for (const c of colecoes) {
    await prisma.colecao.update({
      where: { id: c.id },
      data: { slug: gerarSlug(c.nome) }
    })
  }
  
  console.log('Slugs atualizados!')
  await prisma.$disconnect()
}

main()
