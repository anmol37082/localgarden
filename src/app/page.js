import Hero from "../features/home/components/hero";
import AboutSection from "../features/home/components/AboutSection";
import BannerSection from "../features/home/components/BannerSection";
import CaseStudiesSection from "../features/home/components/CaseStudiesSection";
import FeaturePanelSection from "../features/home/components/FeaturePanelSection";
import DealsSection from "../features/home/components/DealsSection";
import ProductSection from "../features/home/components/ProductSection";
import PricingSection from "../features/home/components/PricingSection";
import TestimonialsSection from "../features/home/components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturePanelSection />
      <ProductSection />
      <DealsSection />
      <CaseStudiesSection />
      <PricingSection />
      <BannerSection />
      <TestimonialsSection />
    </>
  );
}
