import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <CategoriasFiltroLateral />
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
