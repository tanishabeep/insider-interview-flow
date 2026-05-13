import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { SocialProof } from "@/components/site/SocialProof";
import { BuiltBy } from "@/components/site/BuiltBy";
import { CurrentAffairs } from "@/components/site/CurrentAffairs";
import { FeatureRows } from "@/components/site/FeatureRows";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <SocialProof />
      <FeatureRows />
      <BuiltBy />
      <CurrentAffairs />
      <Pricing />
      <Footer />
    </main>
  );
}
