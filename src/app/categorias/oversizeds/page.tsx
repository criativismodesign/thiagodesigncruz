import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

export default function OversizedsPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="OVERSIZEDS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Oversizeds', href: '/categorias/oversizeds', ativo: true },
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
