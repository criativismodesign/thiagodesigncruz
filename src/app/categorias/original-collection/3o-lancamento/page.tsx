import BannerCategoria from '@/components/BannerCategoria'

export default function TerceiroLancamentoPage() {
  return (
    <main>
      <BannerCategoria 
        titulo="3º LANÇAMENTO" 
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: '3º Lançamento', href: '/categorias/original-collection/3o-lancamento', ativo: true },
        ]} 
      />
      {/* Filtros e produtos - implementar depois */}
    </main>
  )
}
