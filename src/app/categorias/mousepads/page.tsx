import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'

export default function MousepadsPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="MOUSEPADS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Mousepads', href: '/categorias/mousepads', ativo: true },
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
