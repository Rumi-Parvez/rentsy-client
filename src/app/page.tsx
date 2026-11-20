import Image from "next/image";

import CategoriesSection from "./components/CategoriesSection";
import CustomerReviewsSection from "./components/CustomerReviewsSection";
import FeaturedEquipmentSection from "./components/FeaturedEquipmentSection";
import HeroSection from "./components/HeroSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";

export default function Home() {
  return (
    <>
    <div>
     <HeroSection></HeroSection>
     <CategoriesSection></CategoriesSection>
<FeaturedEquipmentSection></FeaturedEquipmentSection>

     <WhyChooseUsSection></WhyChooseUsSection>
     <CustomerReviewsSection></CustomerReviewsSection>
    </div>
    </>
  );
}
