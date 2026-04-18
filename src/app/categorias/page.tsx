import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'

export default function CategoriasPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="CATEGORIAS" 
        chave="banner-categoria-todos-produtos"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Categorias', href: '/categorias', ativo: true },
        ]} 
      />
      <div style={{ 
        maxWidth: '1920px', 
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
      className="lg:!px-[120px]"
      >
        <div className="flex flex-col lg:flex-row lg:items-start">
          <CategoriasFiltroLateralWrapper />
          <CategoriasLadoDireitoWrapper />
        </div>
      </div>
    </main>
  )
}
