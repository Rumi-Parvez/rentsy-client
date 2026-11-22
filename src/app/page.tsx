import CategoriesSection from "./components/CategoriesSection";
import CustomerReviewsSection from "./components/CustomerReviewsSection";
import FAQSection from "./components/FAQSection";
import FeaturedEquipmentSection from "./components/FeaturedEquipmentSection";
import HeroSection from "./components/HeroSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEquipmentSection />
      
      <WhyChooseUsSection />
      <CustomerReviewsSection />
      <FAQSection/>
    </>
  );
}
