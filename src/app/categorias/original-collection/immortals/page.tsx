import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Immortals Collection | UseKIN',
  description: 'Coleção Immortals UseKIN - Ink Series. Camisetas e mouse pads com arte exclusiva estilo sketch premium. Peças colecionáveis para fãs de cultura pop.'
}

export default function ImmortalsPage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="IMMORTALS" 
        colecaoSlug="immortals"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'Immortals', href: '/categorias/original-collection/immortals', ativo: true },
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
          <CategoriasLadoDireitoWrapper colecaoSlug="immortals" />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
