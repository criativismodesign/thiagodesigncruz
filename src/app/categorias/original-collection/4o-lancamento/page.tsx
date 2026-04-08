import BannerCategoria from '@/components/BannerCategoria'

export default function QuartoLancamentoPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="4º LANÇAMENTO" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: '4º Lançamento', href: '/categorias/original-collection/4o-lancamento', ativo: true },
        ]} 
      />
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
