import HeroCarouselWrapper from '@/components/HeroCarouselWrapper'
import OriginalCollectionSectionWrapper from '@/components/OriginalCollectionSectionWrapper'
import MousepadCollectionSectionWrapper from '@/components/MousepadCollectionSectionWrapper'
import ImmortalsCollectionSectionWrapper from '@/components/ImmortalsCollectionSectionWrapper'
import CollectionsSectionWrapper from '@/components/CollectionsSectionWrapper'
import NewsletterSection from '@/components/NewsletterSection'
import OutrosModelosSectionWrapper from '@/components/OutrosModelosSectionWrapper'
import BannerBoxSection from '@/components/BannerBoxSection'

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
