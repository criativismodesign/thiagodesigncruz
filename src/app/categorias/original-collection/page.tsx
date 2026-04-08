import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
