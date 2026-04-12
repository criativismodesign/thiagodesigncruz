import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function QuartoLancamentoPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="4º LANÇAMENTO" 
        colecaoSlug="4o-lancamento"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: '4º Lançamento', href: '/categorias/original-collection/4o-lancamento', ativo: true },
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
          <CategoriasLadoDireitoWrapper colecaoSlug="4o-lancamento" />
        </div>
      </div>
    </main>
  )
}
