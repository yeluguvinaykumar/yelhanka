"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X, Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { ProductArt } from "@/components/commerce/ProductArt";
import { LeafMark } from "@/components/ui/Botanical";
import { cn, formatINR, waLink } from "@/lib/utils";

export function CartDrawer() {
  const { items, subtotal, count, isOpen, closeCart, updateQty, removeItem } = useCart();
  const site = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);
  const shipping = subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : site.shippingFee;
  const remaining = Math.max(site.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / site.freeShippingThreshold) * 100, 100);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [isOpen, closeCart]);

  const whatsappMessage = [
    "Hi Tasty Treasures! I'd like to place this order:",
    "",
    ...items.map(
      (item) =>
        `• ${item.name} — ${item.packLabel} (${item.grams} g) × ${item.qty} — ${formatINR(item.price * item.qty)}`,
    ),
    "",
    `Subtotal: ${formatINR(subtotal)}`,
    `Estimated shipping: ${shipping === 0 ? "Free" : formatINR(shipping)}`,
    `Total: ${formatINR(subtotal + shipping)}`,
    "",
    "Please confirm availability and payment details. Thank you!",
  ].join("\n");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[80] bg-forest/45 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[85] flex w-full max-w-[460px] flex-col bg-ivory shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.26em] text-gold">Your selection</p>
                <h2 className="mt-1 font-serif text-[1.65rem] text-forest">
                  The basket <span className="text-charcoal/40">({count})</span>
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest transition-colors hover:border-gold"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-forest/10 bg-cream/60 px-6 py-4">
                <div className="flex items-center gap-2 text-[10px] text-forest">
                  <Truck className="h-3.5 w-3.5 text-gold" />
                  {remaining > 0 ? (
                    <span>
                      You&apos;re <strong className="font-semibold">{formatINR(remaining)}</strong> away from free shipping
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-botanical" /> Free shipping unlocked
                    </span>
                  )}
                </div>
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-forest/10">
                  <motion.div
                    className="h-full rounded-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-cream">
                    <LeafMark className="h-9 w-9 text-forest/60" />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-forest">Your basket is empty</h3>
                  <p className="mt-2 max-w-[260px] text-[12px] leading-relaxed text-charcoal/55">
                    Good things are waiting in the pantry. Start with a best seller or a discovery box.
                  </p>
                  <Link href="/shop" onClick={closeCart} className="btn btn-primary btn-sm mt-6">
                    <span>Explore products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-forest/10">
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 py-5"
                    >
                      <Link href={`/shop/${item.slug}`} onClick={closeCart} className="shrink-0">
                        <ProductArt
                          product={{
                            name: item.name,
                            theme: item.theme,
                            accent: item.accent,
                            image: item.image,
                            packs: [{ label: item.packLabel, grams: item.grams, price: item.price }],
                          }}
                          compact
                          className="h-[92px] w-[76px] rounded-lg"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/shop/${item.slug}`}
                              onClick={closeCart}
                              className="font-serif text-[16px] leading-tight text-forest hover:text-burgundy"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/45">
                              {item.packLabel} · {item.grams} g
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="text-charcoal/30 transition-colors hover:text-burgundy"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex h-8 items-center rounded-full border border-forest/15">
                            <button
                              type="button"
                              onClick={() => updateQty(item.key, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center text-forest hover:text-burgundy"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[24px] text-center text-[11px] font-medium">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.key, item.qty + 1)}
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center text-forest hover:text-burgundy"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[13px] font-medium text-forest">
                            {formatINR(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-forest/10 bg-cream/50 px-6 py-5">
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between text-charcoal/65">
                    <span>Subtotal</span>
                    <span className="font-medium text-forest">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/65">
                    <span>Estimated shipping</span>
                    <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-forest/10 pt-2.5 text-[14px] font-medium text-forest">
                    <span>Total</span>
                    <span>{formatINR(subtotal + shipping)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary mt-4 w-full"
                >
                  <span>Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={waLink(site.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm mt-2 w-full"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Order on WhatsApp</span>
                </a>
                <p className="mt-3 text-center text-[9px] uppercase tracking-[0.14em] text-charcoal/40">
                  Taxes included · Order confirmed personally
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
