import BannerCategoria from '@/components/BannerCategoria'

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
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
