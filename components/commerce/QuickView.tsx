"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/commerce/ProductArt";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/utils";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [packIndex, setPackIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    setPackIndex(0);
    setQty(1);
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [product, onClose]);

  const pack = product?.packs[packIndex];

  return (
    <AnimatePresence>
      {product && pack && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-forest/50 backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-ivory shadow-lift sm:rounded-2xl md:grid-cols-2"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-forest/15 bg-ivory/90 text-forest backdrop-blur transition-colors hover:border-gold"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative min-h-[280px] overflow-hidden bg-cream md:min-h-[460px]">
              <ProductArt product={{ ...product, packs: [pack] }} />
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1.5 text-[7.5px] uppercase tracking-[0.16em] text-ivory">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[8px] uppercase tracking-[0.22em] text-gold">
                {product.type} · Small batch
              </p>
              <h2 className="mt-2 font-serif text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.05] text-forest">
                {product.name}
              </h2>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-[1.3rem] text-forest">{formatINR(pack.price)}</span>
                {pack.compareAt && pack.compareAt > pack.price && (
                  <span className="text-[12px] text-charcoal/35 line-through">
                    {formatINR(pack.compareAt)}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-[0.12em] text-charcoal/40">
                  {pack.grams} g
                </span>
              </div>
              <p className="mt-4 text-[12px] leading-[1.8] text-charcoal/60">{product.short}</p>

              <div className="mt-5">
                <p className="field-label">Pack size</p>
                <div className="flex flex-wrap gap-2">
                  {product.packs.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setPackIndex(index)}
                      className={`rounded-full border px-3.5 py-2 text-[9px] uppercase tracking-[0.12em] transition-colors ${
                        index === packIndex
                          ? "border-forest bg-forest text-ivory"
                          : "border-forest/15 text-charcoal/60 hover:border-gold"
                      }`}
                    >
                      {option.label} · {option.grams} g
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 items-center rounded-full border border-forest/15">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-11 w-10 place-items-center text-forest hover:text-burgundy"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-[12px]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(20, value + 1))}
                    aria-label="Increase quantity"
                    className="grid h-11 w-10 place-items-center text-forest hover:text-burgundy"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-charcoal/45">
                  <Check className="h-3.5 w-3.5 text-botanical" />
                  {product.stock > 0 ? "In stock" : "Sold out"}
                </span>
              </div>

              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={() => {
                  addItem(product, packIndex, qty);
                  onClose();
                }}
                className="btn btn-primary mt-5 w-full"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add {qty} to cart</span>
              </button>
              <Link
                href={`/shop/${product.slug}`}
                onClick={onClose}
                className="mt-4 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-forest hover:text-burgundy"
              >
                Full product details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
