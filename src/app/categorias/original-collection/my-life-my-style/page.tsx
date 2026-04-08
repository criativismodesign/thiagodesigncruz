import BannerCategoria from '@/components/BannerCategoria'

export default function MyLifeMyStylePage() {
  return (
    <main>
      <BannerCategoria 
        titulo="MY LIFE MY STYLE" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'My Life My Style', href: '/categorias/original-collection/my-life-my-style', ativo: true },
        ]} 
      />
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
