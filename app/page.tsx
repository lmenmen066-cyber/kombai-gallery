import { Navbar } from '@/components/site/Navbar'
import { Hero } from '@/components/site/Hero'
import { Footer } from '@/components/site/Footer'
import {
  FeaturesSection,
  ShowcaseSection,
  MetricsSection,
  PricingSection,
  CTASection,
  InteractiveSection,
  MediaSection,
  FormSection,
  WizardSection,
  CommsSection,
  VoicesSection,
  ElementsSection,
} from '@/components/site/HomeSections'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { BackToTop } from '@/components/ui/BackToTop'
import { FloatingDock } from '@/components/site/FloatingDock'
import { ImagerySection } from '@/components/site/ImagerySection'

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <ShowcaseSection />
        <MediaSection />
        <ImagerySection />
        <ElementsSection />
        <MetricsSection />
        <InteractiveSection />
        <FormSection />
        <WizardSection />
        <CommsSection />
        <VoicesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
      <FloatingDock />
    </>
  )
}
