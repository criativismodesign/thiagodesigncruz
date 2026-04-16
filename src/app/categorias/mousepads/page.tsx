import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function MousepadsPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="MOUSEPADS" 
        chave="banner-categoria-mousepads"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Mousepads', href: '/categorias/mousepads', ativo: true },
        ]} 
      />
      <div style={{ 
        maxWidth: '1920px', 
        margin: '0 auto',
        paddingLeft: '120px',
        paddingRight: '120px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <CategoriasFiltroLateralWrapper chaveBanner="banner-lateral-mousepads" />
          <CategoriasLadoDireitoWrapper tipo="mousepad" categoria="avulso" />
        </div>
      </div>
    </main>
  )
}
