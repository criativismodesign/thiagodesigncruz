import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'

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
