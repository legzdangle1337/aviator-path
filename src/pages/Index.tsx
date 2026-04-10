import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SearchSection } from "@/components/SearchSection";
import { StatsBar } from "@/components/StatsBar";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TransparencySection } from "@/components/TransparencySection";
import { EmailCapture } from "@/components/EmailCapture";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <StatsBar />
      <FeaturesGrid />
      <HowItWorks />
      <TransparencySection />
      <EmailCapture />
      <Footer />
    </div>
  );
};

export default Index;
