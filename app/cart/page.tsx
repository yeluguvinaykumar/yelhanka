import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Your Basket",
  description:
    "Review your Tasty Treasures selection, adjust quantities and continue to a personal order confirmation.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const products = await getProducts();

  return (
    <>
      <section className="paper border-b border-forest/10">
        <div className="editorial-container py-8 sm:py-11">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-forest">Shop</Link>
            <span>/</span>
            <span className="text-forest">Basket</span>
          </nav>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Your selection</span>
              <h1 className="mt-4 font-serif text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.92] tracking-[-0.035em] text-forest">
                The <span className="italic text-burgundy">basket.</span>
              </h1>
            </div>
            <p className="max-w-xs text-[11px] leading-[1.8] text-charcoal/50">
              Nothing is charged online. Every order is reviewed and confirmed personally by the
              studio.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container">
          <CartClient products={products} />
        </div>
      </section>
    </>
  );
}
