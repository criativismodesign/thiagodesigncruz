import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function CategoriasPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="TODAS CATEGORIAS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Todos Produtos', href: '/categorias', ativo: true },
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
          <CategoriasLadoDireitoWrapper />
        </div>
      </div>
    </main>
  )
}
