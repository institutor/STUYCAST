import { HeroLanding } from "@/components/landing/HeroLanding";
import { ScrollDrivenSection } from "@/components/landing/ScrollDrivenSection";
import { StatsBanner } from "@/components/landing/StatsBanner";
import { DepartmentsSection } from "@/components/landing/DepartmentsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroLanding />
      <ScrollDrivenSection />
      <StatsBanner />
      <DepartmentsSection />
      <CTASection />
    </>
  );
}
