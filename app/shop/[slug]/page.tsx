import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getProduct, getProducts } from "@/lib/store";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.short,
    openGraph: {
      title: `${product.name} · Tasty Treasures`,
      description: product.short,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const related = [
    ...allProducts.filter((item) => item.category === product.category && item.id !== product.id),
    ...allProducts.filter((item) => item.category !== product.category && item.id !== product.id),
  ].slice(0, 4);

  return (
    <>
      <section className="paper border-b border-forest/10">
        <div className="editorial-container py-7">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-forest">Shop</Link>
            <span>/</span>
            <span className="text-forest">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="editorial-container grid gap-10 py-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:py-16">
          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <ProductGallery product={product} />
            <div className="mt-4 flex items-center justify-between rounded-lg border border-forest/10 bg-cream/40 px-4 py-3">
              <p className="text-[8.5px] uppercase tracking-[0.14em] text-charcoal/40">
                Small-batch packed · Ships across India
              </p>
              <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.12em] text-gold">
                <span className="h-1 w-1 rounded-full bg-gold" />
                {product.packs[0]?.grams} g
              </span>
            </div>
          </div>

          <ProductPurchase product={product} />
        </div>
      </section>

      <section className="border-y border-forest/10 bg-forest py-5 text-ivory">
        <div className="editorial-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-[8.5px] uppercase tracking-[0.2em] text-ivory/60">
          <span>Freeze-dried · Never fried</span>
          <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:block" />
          <span>No added preservatives</span>
          <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:block" />
          <span>Resealable pouch</span>
          <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:block" />
          <span>Packed by hand</span>
        </div>
      </section>

      <section className="paper section-pad">
        <div className="editorial-container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Keep exploring"
              title={
                <>
                  More from the <span className="italic text-burgundy">pantry.</span>
                </>
              }
            />
            <Reveal delay={0.1}>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border-b border-forest/25 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-forest hover:border-gold"
              >
                All products
                <ArrowRight className="arrow-slide h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
