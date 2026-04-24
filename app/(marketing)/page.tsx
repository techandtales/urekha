import dynamic from "next/dynamic";
import FutureHero from "@/components/hero/FutureHero";
import PageLoader from "@/components/ui/PageLoader";

const PricingTiers = dynamic(() => import("@/components/pricing/PricingTiers"));
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const AstrologyEducation = dynamic(
  () => import("@/components/home/AstrologyEducation"),
);

export default async function Home() {

  return (
    <main
      className="min-h-screen bg-white dark:bg-background relative overflow-hidden text-black dark:text-foreground transition-colors duration-300"
      suppressHydrationWarning
    >
      <PageLoader />
      <FutureHero />

      <div className="relative z-10 bg-white dark:bg-background flex flex-col pb-0 transition-colors duration-300">
        <HowItWorks />
        <PricingTiers />
        <Testimonials />
        <AstrologyEducation />
      </div>
    </main>
  );
}
