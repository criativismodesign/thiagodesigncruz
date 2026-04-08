import BannerCategoria from '@/components/BannerCategoria'

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
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
