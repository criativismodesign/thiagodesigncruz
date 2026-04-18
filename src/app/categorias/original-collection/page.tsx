import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'

export default function OriginalCollectionPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="ORIGINAL COLLECTION" 
        chave="banner-categoria-original-collection"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection', ativo: true },
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
          <CategoriasLadoDireitoWrapper categoria="colecao" />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
