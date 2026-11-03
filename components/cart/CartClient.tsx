"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Leaf,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { ProductArt } from "@/components/commerce/ProductArt";
import { LeafMark } from "@/components/ui/Botanical";
import { cn, formatINR, waLink } from "@/lib/utils";

export function CartClient({ products }: { products: Product[] }) {
  const { items, count, subtotal, hydrated, updateQty, removeItem, clearCart, addItem } = useCart();
  const site = useSite();
  const [clearing, setClearing] = useState(false);

  const threshold = Math.max(site.freeShippingThreshold, 1);
  const shipping = subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : site.shippingFee;
  const total = subtotal + shipping;
  const remaining = Math.max(site.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  const whatsappMessage = [
    "Hi Tasty Treasures! I'd like to place this order:",
    "",
    ...items.map(
      (item) =>
        `• ${item.name} — ${item.packLabel} (${item.grams} g) × ${item.qty} — ${formatINR(
          item.price * item.qty,
        )}`,
    ),
    "",
    `Subtotal: ${formatINR(subtotal)}`,
    `Estimated shipping: ${shipping === 0 ? "Free" : formatINR(shipping)}`,
    `Total: ${formatINR(total)}`,
    "",
    "Please confirm availability and payment details. Thank you!",
  ].join("\n");

  const inCart = new Set(items.map((item) => item.productId));
  const recommendations = products
    .filter((product) => product.stock > 0 && !inCart.has(product.id))
    .slice(0, 4);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-[150px] animate-pulse rounded-xl border border-forest/10 bg-cream/60"
            />
          ))}
        </div>
        <div className="h-[330px] animate-pulse rounded-xl border border-forest/10 bg-cream/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-cream/40 px-6 py-16 text-center sm:py-20">
        <span className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/40 bg-ivory">
          <LeafMark className="h-11 w-11 text-forest/60" />
          <span className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-gold" />
        </span>
        <p className="script mt-6 text-[2rem] leading-none text-burgundy">Nothing here yet.</p>
        <h2 className="mt-2 font-serif text-[clamp(1.9rem,4vw,2.7rem)] leading-tight text-forest">
          Your basket is waiting.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[12px] leading-[1.8] text-charcoal/55">
          Start with a single-ingredient fruit pouch, a crisp vegetable chip or a discovery box.
          Goodness travels well.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary group">
            <span>Explore the pantry</span>
            <ArrowRight className="arrow-slide h-4 w-4" />
          </Link>
          <Link href="/shop?category=gift-combos" className="btn btn-secondary">
            <span>Gift combos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
      <div>
        <div className="flex items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">In your basket</p>
            <h2 className="mt-1.5 font-serif text-[1.6rem] text-forest">
              {count} {count === 1 ? "item" : "items"}
            </h2>
          </div>
          {clearing ? (
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setClearing(false);
                }}
                className="text-burgundy underline underline-offset-4"
              >
                Confirm clear
              </button>
              <button type="button" onClick={() => setClearing(false)} className="text-forest/50">
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setClearing(true)}
              className="text-[9px] uppercase tracking-[0.14em] text-charcoal/40 underline underline-offset-4 transition-colors hover:text-burgundy"
            >
              Clear basket
            </button>
          )}
        </div>

        <ul className="divide-y divide-forest/10">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.key}
                layout
                exit={{ opacity: 0, x: 24, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 py-5 sm:gap-6"
              >
                <Link
                  href={`/shop/${item.slug}`}
                  className="group relative h-[124px] w-[98px] shrink-0 overflow-hidden rounded-xl border border-forest/10 sm:h-[144px] sm:w-[116px]"
                  aria-label={`View ${item.name}`}
                  data-cursor="VIEW PRODUCT"
                >
                  <ProductArt
                    product={{
                      name: item.name,
                      theme: item.theme,
                      accent: item.accent,
                      image: item.image,
                      packs: [{ label: item.packLabel, grams: item.grams, price: item.price }],
                    }}
                    compact
                    className="h-full w-full"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[7.5px] uppercase tracking-[0.18em] text-gold">
                        {item.packLabel}
                      </p>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="mt-1 block font-serif text-[1.12rem] leading-tight text-forest transition-colors hover:text-burgundy sm:text-[1.25rem]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-charcoal/40">
                        {item.grams} g · Unit {formatINR(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-charcoal/30 transition-colors hover:bg-burgundy/10 hover:text-burgundy"
                    >
                      <Trash2 className="h-[15px] w-[15px]" />
                    </button>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[10.5px] leading-relaxed text-charcoal/45 sm:text-[11px]">
                    Sealed for freshness. Store in a cool, dry place.
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex h-9 items-center rounded-full border border-forest/15">
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="grid h-9 w-9 place-items-center text-forest transition-colors hover:text-burgundy"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[26px] text-center text-[11.5px] font-medium" aria-live="polite">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, Math.min(item.qty + 1, 20))}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="grid h-9 w-9 place-items-center text-forest transition-colors hover:text-burgundy"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-[1.05rem] text-forest">{formatINR(item.price * item.qty)}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest/10 bg-cream/40 px-5 py-4">
          <p className="flex items-center gap-2 text-[10px] leading-relaxed text-charcoal/50">
            <Leaf className="h-3.5 w-3.5 shrink-0 text-gold" />
            Packed by hand in small batches. Crunch protected in a resealable pouch.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-forest hover:text-burgundy"
          >
            Keep browsing
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <aside className="lg:sticky lg:top-[112px]">
        <div className="overflow-hidden rounded-2xl border border-forest/15 bg-ivory shadow-soft">
          <div className="border-b border-forest/10 bg-cream/50 px-6 py-5">
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Order summary</p>
            <h2 className="mt-1.5 font-serif text-[1.5rem] text-forest">The details.</h2>
          </div>

          <div className="px-6 py-5">
            <div className="rounded-lg border border-gold/25 bg-cream/50 p-3.5">
              <div className="flex items-start gap-2 text-[9.5px] leading-relaxed text-forest">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                {remaining > 0 ? (
                  <span>
                    Add <strong className="font-semibold">{formatINR(remaining)}</strong> more for
                    free delivery.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-botanical" /> Free delivery unlocked.
                  </span>
                )}
              </div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-forest/10">
                <motion.div
                  className="h-full rounded-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 text-[12px]">
              <div className="flex justify-between gap-4 text-charcoal/65">
                <dt>Subtotal</dt>
                <dd className="font-medium text-forest">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-charcoal/65">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-charcoal/45">
                <dt>Taxes</dt>
                <dd>Included</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-forest/10 pt-3 text-[1.1rem] text-forest">
                <dt>Total</dt>
                <dd className="font-medium">{formatINR(total)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="btn btn-primary mt-5 w-full">
              <span>Continue to checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waLink(site.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-2.5 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Order on WhatsApp</span>
            </a>

            <div className="mt-5 space-y-2.5 border-t border-forest/10 pt-4">
              <p className="flex items-start gap-2 text-[9.5px] leading-relaxed text-charcoal/50">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-botanical" />
                No online payment is taken. We confirm stock, delivery and payment personally.
              </p>
              <p className="flex items-start gap-2 text-[9.5px] leading-relaxed text-charcoal/50">
                <ShoppingBag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                Orders are usually packed within 1–2 working days.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[8.5px] uppercase tracking-[0.14em] text-charcoal/35">
          Need help? <Link href="/contact" className="text-burgundy underline underline-offset-2">Write to the studio</Link>
        </p>
      </aside>

      {recommendations.length > 0 && (
        <div className="lg:col-span-2">
          <div className="mt-4 border-t border-forest/10 pt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-[0.24em] text-gold">A little more</p>
                <h2 className="mt-1.5 font-serif text-[1.6rem] text-forest">
                  Good things to add.
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden items-center gap-1.5 border-b border-forest/20 pb-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-forest hover:border-gold sm:inline-flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {recommendations.map((product) => {
                const pack = product.packs[0];
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "group overflow-hidden rounded-xl border border-forest/10 bg-ivory",
                      "transition-all duration-500 hover:border-gold/50 hover:shadow-soft",
                    )}
                  >
                    <Link href={`/shop/${product.slug}`} className="block" data-cursor="VIEW PRODUCT">
                      <div className="relative aspect-[4/3.6] overflow-hidden">
                        <ProductArt product={product} compact />
                      </div>
                    </Link>
                    <div className="p-3.5">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="font-serif text-[0.98rem] leading-tight text-forest hover:text-burgundy"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-forest">
                          {formatINR(pack?.price ?? 0)}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(product, 0)}
                          aria-label={`Add ${product.name} to basket`}
                          className="grid h-7 w-7 place-items-center rounded-full border border-forest/15 text-forest transition-colors hover:border-gold hover:bg-forest hover:text-ivory"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
