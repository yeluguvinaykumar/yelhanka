import type { Metadata } from "next";
import { getContent, getProducts } from "@/lib/store";
import { Hero } from "@/components/home/Hero";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { BrandBanner } from "@/components/home/BrandBanner";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Nature's Goodness, Beautifully Preserved",
  description:
    "Discover premium freeze-dried fruits, dehydrated vegetable chips and single-ingredient superfood powders. Pure ingredients, delicious taste, goodness in every bite.",
};

export default async function HomePage() {
  const [content, products] = await Promise.all([getContent(), getProducts()]);
  const featured = products.filter((product) => product.featured).slice(0, 7);

  return (
    <>
      <Hero hero={content.hero} />
      <MarqueeStrip />
      <BenefitsStrip />
      <CategoryGrid />
      <FeaturedCarousel products={featured} />
      <ProcessTimeline />
      <BrandBanner />
      <StoryTeaser />
      <NewsletterSection />
    </>
  );
}
