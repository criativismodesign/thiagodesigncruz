import BannerCategoria from '@/components/BannerCategoria'

export default function OriginalCollectionPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="ORIGINAL COLLECTION" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection', ativo: true },
        ]} 
      />
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
