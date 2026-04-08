import BannerCategoria from '@/components/BannerCategoria'

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
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
