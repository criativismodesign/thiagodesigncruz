import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

export default function TodosProdutosPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="TODOS PRODUTOS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Todos Produtos', href: '/categorias/todos-produtos', ativo: true },
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
