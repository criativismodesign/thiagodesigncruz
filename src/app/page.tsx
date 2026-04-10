import HeroCarouselWrapper from '@/components/HeroCarouselWrapper'
import OriginalCollectionSection from '@/components/OriginalCollectionSection'
import MousepadCollectionSection from '@/components/MousepadCollectionSection'
import ImmortalsCollectionSection from '@/components/ImmortalsCollectionSection'
import CollectionsSection from '@/components/CollectionsSection'
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
      <CollectionsSection />
      <NewsletterSection source="home" />
      <OutrosModelosSection />
      <BannerBoxSection />
    </main>
  )
}
