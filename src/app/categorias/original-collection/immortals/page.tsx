import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function ImmortalsPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="IMMORTALS" 
        colecaoSlug="immortals"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'Immortals', href: '/categorias/original-collection/immortals', ativo: true },
        ]} 
      />
      <div style={{ 
        maxWidth: '1920px', 
        margin: '0 auto',
        paddingLeft: '120px',
        paddingRight: '120px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper colecaoSlug="immortals" />
        </div>
      </div>
    </main>
  )
}
