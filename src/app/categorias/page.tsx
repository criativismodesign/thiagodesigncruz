import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

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
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Conteúdo dos produtos - implementar depois */}
        </div>
      </div>
    </main>
  )
}
