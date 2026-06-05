import Hero from "../features/home/components/hero";
import AboutSection from "../features/home/components/AboutSection";
import TrustyStrip from "../features/home/components/TrustyStrip";
import BannerSectionThree from "../features/home/components/BannerSectionThree";
import BannerSection from "../features/home/components/BannerSection";
import CaseStudiesSection from "../features/home/components/CaseStudiesSection";
import FeaturePanelSection from "../features/home/components/FeaturePanelSection";
import DealsSection from "../features/home/components/DealsSection";
import BannerSectionTwo from "../features/home/components/BannerSectionTwo";
import ProductSection from "../features/home/components/ProductSection";
import ProductVideosSection from "../features/home/components/ProductVideosSection";
import FAQSection from "../features/home/components/FAQSection";
import TestimonialsSection from "../features/home/components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
     
      <AboutSection />
      <BannerSectionThree />
      <FeaturePanelSection />
      <ProductSection />
      <DealsSection />
      <BannerSectionTwo />
      <CaseStudiesSection />
       <TrustyStrip />
      <ProductVideosSection />
      <BannerSection />
      <FAQSection />
      <TestimonialsSection />
    </>
  );
}
