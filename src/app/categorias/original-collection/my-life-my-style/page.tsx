import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

export default function MyLifeMyStylePage() {
  return (
    <main>
      <BannerCategoria 
        titulo="MY LIFE MY STYLE" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'My Life My Style', href: '/categorias/original-collection/my-life-my-style', ativo: true },
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
