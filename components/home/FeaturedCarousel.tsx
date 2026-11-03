"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function FeaturedCarousel({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: false });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setProgress(ratio);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (direction: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 760), behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const el = scroller.current;
    if (!el) return;
    drag.current = { down: true, startX: event.clientX, scroll: el.scrollLeft, moved: false };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current.down) return;
    const el = scroller.current;
    if (!el) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scroll - delta;
  };

  const endDrag = () => {
    drag.current.down = false;
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 40);
  };

  return (
    <section className="relative overflow-hidden bg-ivory section-pad">
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-serif text-[26vw] leading-none text-forest/[0.025]">
        Treasures
      </div>
      <div className="editorial-container relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <span className="eyebrow">The bestsellers</span>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98] text-forest">
              Loved, reordered, <span className="italic text-burgundy">shared.</span>
            </h2>
            <p className="mt-4 max-w-md text-[12.5px] leading-[1.8] text-charcoal/55">
              The pouches that leave the studio fastest. Small batches, packed by hand and
              ready for your pantry.
            </p>
          </Reveal>

          <div className="flex items-center gap-3">
            <div className="mr-2 hidden h-px w-24 bg-forest/15 lg:block">
              <div
                className="h-px origin-left bg-gold transition-transform duration-300"
                style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }}
              />
            </div>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Previous products"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition-all duration-300",
                canPrev
                  ? "border-forest/20 text-forest hover:border-gold hover:bg-forest hover:text-ivory"
                  : "border-forest/10 text-forest/25",
              )}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Next products"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition-all duration-300",
                canNext
                  ? "border-forest/20 text-forest hover:border-gold hover:bg-forest hover:text-ivory"
                  : "border-forest/10 text-forest/25",
              )}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(event) => {
            if (drag.current.moved) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className="no-scrollbar mt-10 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-3 active:cursor-grabbing"
          role="region"
          aria-label="Featured products carousel"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[78vw] max-w-[330px] shrink-0 snap-start sm:w-[330px]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
          <Link
            href="/shop"
            className="group flex w-[62vw] max-w-[260px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gold/40 bg-cream/50 p-8 text-center transition-colors hover:bg-sage/30 sm:w-[260px]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-forest transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
            <span className="font-serif text-[1.4rem] leading-tight text-forest">
              See every<br />treasure
            </span>
            <span className="text-[8px] uppercase tracking-[0.24em] text-charcoal/45">
              Shop all products
            </span>
          </Link>
        </div>

        <div className="mt-6 h-px w-full bg-forest/10">
          <div
            className="h-px bg-gold transition-all duration-300"
            style={{ width: `${Math.max(progress * 100, 14)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
