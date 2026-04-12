import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function TodosProdutosPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="TODOS PRODUTOS" 
        chave="banner-categoria-todos-produtos"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Todos Produtos', href: '/categorias/todos-produtos', ativo: true },
        ]} 
      />
      <div style={{ 
        maxWidth: '1920px', 
        margin: '0 auto',
        paddingLeft: '120px',
        paddingRight: '120px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper />
        </div>
      </div>
    </main>
  )
}
