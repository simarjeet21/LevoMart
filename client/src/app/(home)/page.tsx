// Home Page (page.tsx)
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/layouts/Features";
import Hero from "@/components/layouts/mainLayout/Hero";

export default function Home() {
  return (
    <div className="bg-beige min-h-screen">
      <Hero />

      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  );
}
