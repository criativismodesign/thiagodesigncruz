import BannerCategoria from '@/components/BannerCategoria'

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
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
