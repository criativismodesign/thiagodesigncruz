import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <CategoriasFiltroLateral />
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
