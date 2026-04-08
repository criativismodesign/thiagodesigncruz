import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <CategoriasFiltroLateral />
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
