"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Leaf,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { formatINR, waLink } from "@/lib/utils";
import { categoryLabel } from "@/lib/catalogue";

function Accordion({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(0);

  const sections = [
    {
      title: "The details",
      content: (
        <div>
          <p className="text-[12px] leading-[1.85] text-charcoal/65">{product.description}</p>
          {product.benefits.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-forest/15 bg-cream/60 px-3 py-1 text-[8px] uppercase tracking-[0.1em] text-forest/65"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ingredients",
      content: (
        <div>
          <p className="text-[12px] leading-[1.85] text-charcoal/65">{product.ingredients}</p>
          <p className="mt-3 text-[10px] leading-relaxed text-charcoal/40">
            Allergens: packed in a facility that also handles tree nuts. If you have a specific
            allergy, please contact us before ordering.
          </p>
        </div>
      ),
    },
    {
      title: "Nutrition",
      content: (
        <div>
          <p className="mb-3 text-[9px] uppercase tracking-[0.14em] text-charcoal/35">
            Typical values per 100 g · indicative
          </p>
          <dl className="divide-y divide-forest/8">
            {product.nutrition.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2 text-[11.5px]">
                <dt className="text-charcoal/60">{row.label}</dt>
                <dd className="text-right font-medium text-forest">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ),
    },
    {
      title: "Storage",
      content: (
        <div>
          <p className="text-[12px] leading-[1.85] text-charcoal/65">{product.storage}</p>
          <p className="mt-3 flex items-center gap-2 text-[10px] text-charcoal/40">
            <Package className="h-3.5 w-3.5 text-gold" />
            Resealable pouch · Keep away from direct sunlight
          </p>
        </div>
      ),
    },
    {
      title: "How to enjoy",
      content: (
        <ul className="space-y-2.5">
          {product.usage.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[12px] leading-[1.7] text-charcoal/65">
              <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="mt-8 divide-y divide-forest/10 border-y border-forest/10">
      {sections.map((section, index) => {
        const isOpen = open === index;
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest">
                {section.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">{section.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const site = useSite();
  const router = useRouter();
  const [packIndex, setPackIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const pack = product.packs[packIndex];
  const maxQty = Math.min(Math.max(product.stock, 1), 20);

  const whatsappMessage = [
    `Hi Tasty Treasures! I'd like to order:`,
    `• ${product.name} — ${pack.label} (${pack.grams} g) × ${qty}`,
    `Price: ${formatINR(pack.price * qty)}`,
    `Product: ${typeof window !== "undefined" ? window.location.href : ""}`,
    "",
    "Please confirm availability and delivery. Thank you!",
  ].join("\n");

  const buyNow = () => {
    addItem(product, packIndex, qty);
    router.push("/checkout");
  };

  return (
    <div>
      <p className="text-[8.5px] font-medium uppercase tracking-[0.24em] text-gold">
        {categoryLabel(product.category)} · {product.type}
      </p>
      <h1 className="mt-3 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.02] text-forest">
        {product.name}
      </h1>
      <p className="mt-3 max-w-md text-[12.5px] leading-[1.8] text-charcoal/60">{product.short}</p>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[1.65rem] leading-none text-forest">{formatINR(pack.price)}</span>
        {pack.compareAt && pack.compareAt > pack.price && (
          <span className="text-[13px] text-charcoal/35 line-through">{formatINR(pack.compareAt)}</span>
        )}
        <span className="text-[9px] uppercase tracking-[0.14em] text-charcoal/40">
          {pack.label} · {pack.grams} g
        </span>
        {pack.compareAt && pack.compareAt > pack.price && (
          <span className="rounded-full bg-burgundy/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.1em] text-burgundy">
            Save {formatINR(pack.compareAt - pack.price)}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[10px]">
        <span
          className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-botanical" : "bg-burgundy"}`}
        />
        {product.stock > 0 ? (
          <span className="text-charcoal/55">
            In stock{product.stock <= 6 ? ` — only ${product.stock} left` : " — packed in small batches"}
          </span>
        ) : (
          <span className="text-burgundy">Sold out — join the waitlist on WhatsApp</span>
        )}
      </div>

      <div className="mt-6">
        <p className="field-label">Choose your pack</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {product.packs.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setPackIndex(index);
                setQty(1);
              }}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                index === packIndex
                  ? "border-forest bg-forest/[0.04] ring-1 ring-forest/10"
                  : "border-forest/15 hover:border-gold"
              }`}
            >
              <span>
                <span className="block text-[10.5px] font-medium text-forest">{option.label}</span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.1em] text-charcoal/40">
                  {option.grams} g
                </span>
              </span>
              <span className="text-[12px] text-forest">{formatINR(option.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-stretch gap-2.5">
        <div className="flex h-[52px] items-center rounded-full border border-forest/15">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            className="grid h-[52px] w-11 place-items-center text-forest hover:text-burgundy"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-[12px]">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(maxQty, value + 1))}
            aria-label="Increase quantity"
            className="grid h-[52px] w-11 place-items-center text-forest hover:text-burgundy"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={() => addItem(product, packIndex, qty)}
          className="btn btn-primary min-w-[180px] flex-1"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Add to cart</span>
        </button>
      </div>

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={buyNow}
          className="btn btn-secondary"
        >
          <span>Buy now</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <a
          href={waLink(site.whatsapp, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Order on WhatsApp</span>
        </a>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-forest/10 bg-cream/50 p-4 sm:grid-cols-4">
        {[
          { icon: Truck, title: "Free over ₹999" },
          { icon: Leaf, title: "Real ingredients" },
          { icon: ShieldCheck, title: "Sealed freshness" },
          { icon: Package, title: "Small batch" },
        ].map(({ icon: Icon, title }) => (
          <div key={title} className="flex flex-col items-center gap-1.5 text-center">
            <Icon className="h-4 w-4 text-gold" strokeWidth={1.4} />
            <span className="text-[7.5px] uppercase leading-[1.4] tracking-[0.1em] text-charcoal/50">
              {title}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-charcoal/40">
        <ShieldCheck className="h-3.5 w-3.5 text-botanical" />
        Online payment is not enabled — we confirm every order personally.
      </p>

      <Accordion product={product} />

      <p className="mt-5 text-[9px] leading-relaxed text-charcoal/35">
        Need help choosing? <Link href="/contact" className="text-burgundy underline underline-offset-2">Write to us</Link> or message the studio on WhatsApp. We usually reply within one working day.
      </p>
    </div>
  );
}
