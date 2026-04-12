import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function MousepadsPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="MOUSEPADS" 
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
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper tipo="mousepad" categoria="avulso" />
        </div>
      </div>
    </main>
  )
}
