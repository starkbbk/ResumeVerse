import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PreviewCards from "@/components/PreviewCards";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <PreviewCards />
      <HowItWorks />
      <Footer />
    </main>
  );
}
