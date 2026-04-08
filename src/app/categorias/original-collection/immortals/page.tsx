import BannerCategoria from '@/components/BannerCategoria'

export default function ImmortalsPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="IMMORTALS" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'Immortals', href: '/categorias/original-collection/immortals', ativo: true },
        ]} 
      />
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
