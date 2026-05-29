import { BrandStory } from "@/components/BrandStory";
import { Care } from "@/components/Care";
import { CartDrawer } from "@/components/CartDrawer";
import { EmailSignup } from "@/components/EmailSignup";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OurCloth } from "@/components/OurCloth";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustStrip } from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <ProductGrid />
        <OurCloth />
        <BrandStory />
        <Care />
        <Faq />
        <EmailSignup />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
