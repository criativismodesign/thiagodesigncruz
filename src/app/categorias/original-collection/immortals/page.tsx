import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

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
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Conteúdo dos produtos - implementar depois */}
        </div>
      </div>
    </main>
  )
}
