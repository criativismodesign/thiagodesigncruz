import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function MyLifeMyStylePage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="MY LIFE MY STYLE" 
        colecaoSlug="my-life-my-style"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'My Life My Style', href: '/categorias/original-collection/my-life-my-style', ativo: true },
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
          <CategoriasLadoDireitoWrapper colecaoSlug="my-life-my-style" />
        </div>
      </div>
    </main>
  )
}
