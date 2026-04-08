import BannerCategoria from '@/components/BannerCategoria'
import CategoriasFiltroLateral from '@/components/CategoriasFiltroLateral'
import CategoriasLadoDireito from '@/components/CategoriasLadoDireito'

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
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <CategoriasFiltroLateral />
        <CategoriasLadoDireito />
      </div>
    </main>
  )
}
