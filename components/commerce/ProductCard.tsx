"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/commerce/ProductArt";
import { Tilt } from "@/components/ui/Tilt";
import { useCart } from "@/components/providers/CartProvider";
import { categoryLabel } from "@/lib/catalogue";
import { cn, formatINR } from "@/lib/utils";

export function ProductCard({
  product,
  onQuickView,
  className,
  index = 0,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
  index?: number;
}) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const pack = product.packs[0];
  const compare = pack?.compareAt;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-forest/10 bg-ivory transition-all duration-500 ease-premium hover:border-gold/50 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          data-cursor="VIEW PRODUCT"
          className="block"
        >
          <div className="relative aspect-[4/4.7] overflow-hidden">
            <Tilt className="absolute inset-0" max={5}>
              <div className="absolute inset-0 transition-transform duration-[900ms] ease-premium group-hover:scale-[1.045]">
                <ProductArt product={product} />
              </div>
            </Tilt>
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-2">
          {product.badge && (
            <span className="rounded-full bg-forest px-3 py-1.5 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-ivory">
              {product.badge}
            </span>
          )}
          {compare && compare > (pack?.price ?? 0) && (
            <span className="rounded-full bg-burgundy px-3 py-1.5 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-ivory">
              Save {formatINR(compare - (pack?.price ?? 0))}
            </span>
          )}
          {product.stock <= 0 && (
            <span className="rounded-full bg-charcoal px-3 py-1.5 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-ivory">
              Sold out
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition-all duration-500 md:opacity-0 md:group-hover:opacity-100">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-ivory/95 text-forest shadow-soft backdrop-blur transition-colors hover:bg-forest hover:text-ivory"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={() => addItem(product, 0)}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-0 place-items-center rounded-full bg-forest text-ivory opacity-100 shadow-lift transition-all duration-500 ease-premium hover:bg-burgundy md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:hidden"
        >
          <Plus className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[7.5px] font-medium uppercase tracking-[0.2em] text-gold">
          {categoryLabel(product.category)}
        </p>
        <Link href={`/shop/${product.slug}`} className="mt-1.5 block">
          <h3 className="font-serif text-[1.15rem] leading-[1.15] text-forest transition-colors group-hover:text-burgundy">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.6] text-charcoal/55">
          {product.short}
        </p>
        <div className="mt-3 flex items-end justify-between border-t border-forest/8 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium text-forest">{formatINR(pack?.price ?? 0)}</span>
            {compare && compare > (pack?.price ?? 0) && (
              <span className="text-[10px] text-charcoal/35 line-through">{formatINR(compare)}</span>
            )}
          </div>
          <span className="text-[8px] uppercase tracking-[0.12em] text-charcoal/40">
            {pack?.grams} g
          </span>
        </div>
      </div>
    </motion.article>
  );
}
