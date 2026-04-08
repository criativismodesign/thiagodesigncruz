import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
          <CategoriasFiltroLateral />
          <CategoriasLadoDireito />
        </div>
      </div>
    </main>
  )
}
