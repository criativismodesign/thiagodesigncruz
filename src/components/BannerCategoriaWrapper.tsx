import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'
import BannerCategoria from './BannerCategoria'

export default async function BannerCategoriaWrapper({ 
  titulo, 
  breadcrumb, 
  chave,
  colecaoSlug
}: { 
  titulo: string
  breadcrumb: any[]
  chave?: string
  colecaoSlug?: string
}) {
  noStore()
  
  let imagem = '/imagens/hero/banner-categoria.jpg'
  let imagemMobile = ''
  
  try {
    if (colecaoSlug) {
      const colecao = await prisma.colecao.findFirst({ where: { slug: colecaoSlug } })
      if (colecao?.imagemBannerCategoria) imagem = colecao.imagemBannerCategoria
    } else if (chave) {
      const banner = await prisma.bannerConfig.findUnique({ where: { chave } })
      if (banner?.imagem) imagem = banner.imagem
      if ((banner as any)?.imagemMobile) imagemMobile = (banner as any).imagemMobile
    }
  } catch (error) {
    // usa imagem padrão
  }

  return <BannerCategoria titulo={titulo} breadcrumb={breadcrumb} imagem={imagem} imagemMobile={imagemMobile} />
}
