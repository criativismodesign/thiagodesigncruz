import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

export default function ImmortalsPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="IMMORTALS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'Immortals', href: '/categorias/original-collection/immortals', ativo: true },
        ]} 
      />
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <CategoriasFiltroLateral />
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
