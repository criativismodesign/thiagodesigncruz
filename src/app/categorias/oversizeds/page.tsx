import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Camisetas Oversized | UseKIN',
  description: 'Camisetas oversized premium com estampas exclusivas do universo geek, anime, games e cultura pop. Modelagem ampla, tecido suedine 250g. Entrega para todo o Brasil.'
}

export default function OversizedsPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="OVERSIZEDS" 
        chave="banner-categoria-oversizeds"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Oversizeds', href: '/categorias/oversizeds', ativo: true },
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
          <CategoriasLadoDireitoWrapper tipo="camiseta" categoria="avulso" />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
