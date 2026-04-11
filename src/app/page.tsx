import HeroCarouselWrapper from '@/components/HeroCarouselWrapper'
import OriginalCollectionSection from '@/components/OriginalCollectionSection'
import MousepadCollectionSection from '@/components/MousepadCollectionSection'
import ImmortalsCollectionSection from '@/components/ImmortalsCollectionSection'
import CollectionsSectionWrapper from '@/components/CollectionsSectionWrapper'
import NewsletterSection from '@/components/NewsletterSection'
import OutrosModelosSection from '@/components/OutrosModelosSection'
import BannerBoxSection from '@/components/BannerBoxSection'

export default function Home() {
  return (
    <main>
      <HeroCarouselWrapper />
      <OriginalCollectionSection />
      <MousepadCollectionSection />
      <ImmortalsCollectionSection />
      <CollectionsSectionWrapper />
      <NewsletterSection source="home" />
      <OutrosModelosSection />
      <BannerBoxSection />
    </main>
  )
}
