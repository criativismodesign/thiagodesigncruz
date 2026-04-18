import BannerCategoriaWrapper from '@/components/BannerCategoriaWrapper'
import CategoriasFiltroLateralWrapper from '@/components/CategoriasFiltroLateralWrapper'
import CategoriasLadoDireitoWrapper from '@/components/CategoriasLadoDireitoWrapper'
import BannerLateralCategorias from '@/components/BannerLateralCategorias'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Life My Style Collection | UseKIN',
  description: 'Coleção My Life My Style UseKIN - Street Art. Camisetas e mouse pads com personagens semirealistas e estética streetwear premium.'
}

export default function MyLifeMyStylePage() {
  return (
    <main>
      <BannerCategoriaWrapper 
        titulo="MY LIFE MY STYLE" 
        colecaoSlug="my-life-my-style"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Original Collection', href: '/categorias/original-collection' },
          { label: 'My Life My Style', href: '/categorias/original-collection/my-life-my-style', ativo: true },
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
          <CategoriasLadoDireitoWrapper colecaoSlug="my-life-my-style" />
        </div>
      </div>
      <BannerLateralCategorias />
    </main>
  )
}
