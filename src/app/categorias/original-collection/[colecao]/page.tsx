import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'

export default async function ColecaoPage({
  params,
}: {
  params: Promise<{ colecao: string }>
}) {
  const { colecao } = await params

  const titulo = colecao
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <main>
      <BannerCategoriaWrapper 
        titulo={titulo.toUpperCase()} 
        colecaoSlug={colecao}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: titulo, href: `/categorias/original-collection/${colecao}`, ativo: true },
        ]} />
      <div style={{ maxWidth: '1920px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}
      className="lg:!px-[120px]"
      >
        <div className="flex flex-col lg:flex-row lg:items-start">
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper colecaoSlug={colecao} />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
