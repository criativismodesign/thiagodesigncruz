import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function OversizedsPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="OVERSIZEDS" 
        chave="banner-categoria-oversizeds"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Oversizeds', href: '/categorias/oversizeds', ativo: true },
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
          <CategoriasLadoDireitoWrapper tipo="camiseta" categoria="avulso" />
        </div>
      </div>
    </main>
  )
}
