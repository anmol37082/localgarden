import Hero from "../components/hero";
import AboutSection from "../components/AboutSection";
import BannerSection from "../components/BannerSection";
import CaseStudiesSection from "../components/CaseStudiesSection";
import FeaturePanelSection from "../components/FeaturePanelSection";
import FooterSection from "../components/FooterSection";
import DealsSection from "../components/DealsSection";
import ProductSection from "../components/ProductSection";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";

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
      <FooterSection />
    </>
  );
}
