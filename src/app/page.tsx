import HeroCarousel from '@/components/HeroCarousel'
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
      <HeroCarousel />
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
