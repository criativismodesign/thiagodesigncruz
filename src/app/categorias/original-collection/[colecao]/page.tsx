import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

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
      <BannerCategoria titulo={titulo.toUpperCase()} breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Original Collection', href: '/categorias/original-collection' },
        { label: titulo, href: `/categorias/original-collection/${colecao}`, ativo: true },
      ]} />
      <div style={{ maxWidth: '1920px', margin: '0 auto', paddingLeft: '120px', paddingRight: '120px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper colecaoSlug={colecao} />
        </div>
      </div>
    </main>
  )
}
