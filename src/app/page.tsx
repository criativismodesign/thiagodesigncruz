import HeroCarouselWrapper from '@/components/HeroCarouselWrapper'
import nextDynamic from 'next/dynamic'

const OriginalCollectionSectionWrapper = nextDynamic(() => import('@/components/OriginalCollectionSectionWrapper'))
const MousepadCollectionSectionWrapper = nextDynamic(() => import('@/components/MousepadCollectionSectionWrapper'))
const ImmortalsCollectionSectionWrapper = nextDynamic(() => import('@/components/ImmortalsCollectionSectionWrapper'))
const CollectionsSectionWrapper = nextDynamic(() => import('@/components/CollectionsSectionWrapper'))
const NewsletterSection = nextDynamic(() => import('@/components/NewsletterSection'))
const OutrosModelosSectionWrapper = nextDynamic(() => import('@/components/OutrosModelosSectionWrapper'))
const BannerBoxSection = nextDynamic(() => import('@/components/BannerBoxSection'))

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main>
      <HeroCarouselWrapper />
      <div style={{ minHeight: '400px' }}>
        <OriginalCollectionSectionWrapper />
      </div>
      <MousepadCollectionSectionWrapper />
      <ImmortalsCollectionSectionWrapper />
      <CollectionsSectionWrapper />
      <NewsletterSection source="home" />
      <OutrosModelosSectionWrapper />
      <BannerBoxSection />
    </main>
  )
}
