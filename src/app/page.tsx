import Image from "next/image";

import FeaturedEquipmentSection from "./components/FeaturedEquipmentSection";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  return (
    <>
    <div>
     <HeroSection></HeroSection>
<FeaturedEquipmentSection></FeaturedEquipmentSection>
     <HowItWorks></HowItWorks>
    </div>
    </>
  );
}
