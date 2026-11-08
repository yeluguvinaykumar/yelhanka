"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/commerce/ProductArt";
import { Tilt } from "@/components/ui/Tilt";
import { cn } from "@/lib/utils";

const views = [
  { id: "front" as const, label: "Front" },
  { id: "detail" as const, label: "Detail" },
  { id: "ingredients" as const, label: "Ingredient" },
];

export function ProductGallery({ product }: { product: Product }) {
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef<number | null>(null);

  const active = views[view];

  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin(
      `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  const swipe = (direction: number) => {
    setView((current) => (current + direction + views.length) % views.length);
  };

  return (
    <div>
      <div
        className="group relative overflow-hidden rounded-xl border border-forest/10 bg-cream"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={move}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const end = event.changedTouches[0]?.clientX ?? touchStart.current;
          const diff = end - touchStart.current;
          if (Math.abs(diff) > 45) swipe(diff < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <div className="relative aspect-[4/4.4] overflow-hidden sm:aspect-[4/4.2]">
          <Tilt className="absolute inset-0" max={6}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: zoom ? 1.18 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                style={{ transformOrigin: origin }}
              >
                <ProductArt
                  product={product}
                  view={active.id}
                  className="h-full w-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </Tilt>
        </div>

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-forest px-3.5 py-2 text-[7.5px] font-semibold uppercase tracking-[0.18em] text-ivory">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-forest/15 bg-ivory/85 px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-forest/60 backdrop-blur">
          <ZoomIn className="h-3 w-3" />
          Hover to zoom
        </span>

        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Open fullscreen gallery"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-forest/15 bg-ivory/85 text-forest backdrop-blur transition-colors hover:border-gold"
        >
          <Expand className="h-3.5 w-3.5" />
        </button>

        <div className="absolute bottom-4 right-4 flex gap-1.5">
          <button
            type="button"
            onClick={() => swipe(-1)}
            aria-label="Previous gallery view"
            className="grid h-8 w-8 place-items-center rounded-full border border-forest/15 bg-ivory/85 text-forest backdrop-blur"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => swipe(1)}
            aria-label="Next gallery view"
            className="grid h-8 w-8 place-items-center rounded-full border border-forest/15 bg-ivory/85 text-forest backdrop-blur"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {views.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(index)}
            aria-label={`View ${item.label}`}
            aria-pressed={view === index}
            className={cn(
              "overflow-hidden rounded-lg border transition-all duration-300",
              view === index ? "border-gold ring-1 ring-gold/30" : "border-forest/10 hover:border-gold/50",
            )}
          >
            <div className="relative aspect-[4/3] bg-cream">
              <ProductArt product={product} view={item.id} compact />
              <span className="absolute inset-x-0 bottom-0 bg-forest/55 py-1 text-center text-[7px] uppercase tracking-[0.14em] text-ivory">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-cream"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} gallery`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <p className="font-serif text-lg text-forest">{product.name}</p>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close fullscreen gallery"
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-4 pb-4">
              <div className="relative h-full max-h-[75vh] w-full max-w-3xl overflow-hidden rounded-xl border border-forest/10 bg-cream">
                <ProductArt product={product} view={active.id} />
              </div>
            </div>
            <div className="flex justify-center gap-4 pb-6">
              <button
                type="button"
                onClick={() => swipe(-1)}
                aria-label="Previous view"
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {views.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      view === index ? "bg-burgundy" : "bg-forest/20",
                    )}
                    aria-label={`Show ${item.label}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => swipe(1)}
                aria-label="Next view"
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
