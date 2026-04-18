import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todos os Produtos | UseKIN',
  description: 'Explore toda a coleção UseKIN. Camisetas oversized e mouse pads com estampas exclusivas do universo geek, anime, games e cultura pop. Entrega para todo o Brasil.',
  openGraph: {
    title: 'Todos os Produtos | UseKIN',
    description: 'Camisetas e mouse pads premium com estampas exclusivas geek, anime e games.',
  }
}

interface Props {
  searchParams: Promise<{ busca?: string }>
}

export default async function TodosProdutosPage({ searchParams }: Props) {
  const params = await searchParams
  const busca = params?.busca || ''

  return (
    <main>
      <BannerCategoriaWrapper 
        titulo={busca ? `Resultados para: "${busca}"` : "TODOS PRODUTOS"}
        chave="banner-categoria-todos-produtos"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Todos Produtos', href: '/categorias/todos-produtos', ativo: true },
        ]} 
      />
      <div style={{ maxWidth: '1920px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}
      className="lg:!px-[120px]"
      >
        <div className="flex flex-col lg:flex-row lg:items-start">
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper busca={busca} />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
