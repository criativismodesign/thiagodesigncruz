import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

export default function OriginalCollectionPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="ORIGINAL COLLECTION" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection', ativo: true },
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
