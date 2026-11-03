"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  MessageCircle,
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuickView } from "@/components/commerce/QuickView";
import { LeafMark } from "@/components/ui/Botanical";
import { categories, sortOptions, benefitFilters, productTypes } from "@/lib/catalogue";
import { useSite } from "@/components/providers/SiteProvider";
import { cn, waLink } from "@/lib/utils";

type Props = {
  products: Product[];
  initialCategory?: string;
};

export function ShopClient({ products, initialCategory }: Props) {
  const site = useSite();
  const validInitial = categories.some((category) => category.id === initialCategory)
    ? initialCategory!
    : "all";
  const [category, setCategory] = useState(validInitial);
  const [types, setTypes] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(null, "", url.toString());
  }, [category]);

  useEffect(() => {
    if (!filterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filterOpen]);

  const toggle = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (types.length && !types.includes(product.type)) return false;
      if (benefits.length && !benefits.every((benefit) => product.benefits.includes(benefit as never)))
        return false;
      if (
        search &&
        !`${product.name} ${product.short} ${product.ingredients} ${product.type}`
          .toLowerCase()
          .includes(search)
      )
        return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.packs[0].price - b.packs[0].price);
      case "price-desc":
        return [...result].sort((a, b) => b.packs[0].price - a.packs[0].price);
      case "newest":
        return [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "popularity":
        return [...result].sort((a, b) => b.stock - a.stock);
      default:
        return [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, category, types, benefits, query, sort]);

  const activeCount = types.length + benefits.length + (category !== "all" ? 1 : 0) + (query ? 1 : 0);

  const reset = () => {
    setCategory("all");
    setTypes([]);
    setBenefits([]);
    setQuery("");
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((item) => {
      counts[item.id] = products.filter((product) => product.category === item.id).length;
    });
    return counts;
  }, [products]);

  const filterContent = (
    <div className="space-y-7">
      <div>
        <p className="text-[8.5px] font-semibold uppercase tracking-[0.24em] text-gold">Collections</p>
        <div className="mt-3 space-y-1">
          {[{ id: "all", name: "All products" }, ...categories].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[11px] transition-colors",
                category === item.id
                  ? "bg-forest text-ivory"
                  : "text-charcoal/65 hover:bg-cream hover:text-forest",
              )}
            >
              <span>{item.name}</span>
              <span
                className={cn(
                  "text-[9px]",
                  category === item.id ? "text-gold" : "text-charcoal/35",
                )}
              >
                {categoryCounts[item.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-forest/10" />

      <div>
        <p className="text-[8.5px] font-semibold uppercase tracking-[0.24em] text-gold">Product type</p>
        <div className="mt-3 space-y-2">
          {productTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type, types, setTypes)}
              aria-pressed={types.includes(type)}
              className="group flex w-full items-center gap-2.5 text-left text-[11px] text-charcoal/65 hover:text-forest"
            >
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-[3px] border transition-colors",
                  types.includes(type)
                    ? "border-forest bg-forest text-ivory"
                    : "border-forest/25 bg-ivory group-hover:border-gold",
                )}
              >
                {types.includes(type) && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
              </span>
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-forest/10" />

      <div>
        <p className="text-[8.5px] font-semibold uppercase tracking-[0.24em] text-gold">Goodness</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {benefitFilters.map((benefit) => (
            <button
              key={benefit}
              type="button"
              onClick={() => toggle(benefit, benefits, setBenefits)}
              aria-pressed={benefits.includes(benefit)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[8.5px] uppercase tracking-[0.09em] transition-colors",
                benefits.includes(benefit)
                  ? "border-burgundy bg-burgundy text-ivory"
                  : "border-forest/15 text-charcoal/60 hover:border-gold",
              )}
            >
              {benefit}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-charcoal/35">
          Filters reflect the benefits listed on each product. Food is not medicine; enjoy as
          part of a varied diet.
        </p>
      </div>

      <div className="rounded-xl bg-cream p-4">
        <LeafMark className="h-6 w-6 text-forest/50" />
        <p className="mt-2 font-serif text-[16px] leading-tight text-forest">Need a hand?</p>
        <p className="mt-1 text-[10px] leading-relaxed text-charcoal/55">
          Tell us what you&apos;re looking for and we&apos;ll help you choose.
        </p>
        <a
          href={waLink(site.whatsapp, "Hi Tasty Treasures! Can you help me choose a product?")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-burgundy"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Chat with us
        </a>
      </div>
    </div>
  );

  return (
    <>
      <section className="paper border-b border-forest/10 section-pad-sm">
        <div className="editorial-container grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40">
              <Link href="/" className="hover:text-forest">Home</Link>
              <span>/</span>
              <span className="text-forest">Shop</span>
            </nav>
            <h1 className="mt-5 font-serif text-[clamp(3rem,7vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.035em] text-forest">
              Our
              <br />
              <span className="italic text-burgundy">products.</span>
            </h1>
            <p className="mt-5 max-w-md text-[13px] leading-[1.85] text-charcoal/60">
              Discover healthy, natural and delicious products made with care. Every pouch is
              a short ingredient list and a long, slow process.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[9px] uppercase tracking-[0.16em] text-charcoal/45">
              <span><strong className="font-medium text-forest">{products.length}</strong> products</span>
              <span><strong className="font-medium text-forest">4</strong> collections</span>
              <span><strong className="font-medium text-forest">0</strong> preservatives</span>
            </div>
          </div>

          <div className="relative hidden h-[300px] sm:block lg:h-[340px]">
            <div className="absolute right-[8%] top-0 h-[85%] w-[52%] overflow-hidden rounded-t-[120px] rounded-b-xl border border-gold/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/category-fruits.jpg" alt="Freeze-dried fruit assortment" className="h-full w-full object-cover" />
            </div>
            <div className="absolute right-0 top-[22%] h-[66%] w-[34%] overflow-hidden rounded-xl border border-ivory/60 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/category-powders.jpg" alt="Superfood powders" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-[3%] left-[4%] flex items-center gap-3 rounded-xl border border-gold/25 bg-ivory/90 px-4 py-3 shadow-soft backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-ivory">
                <LeafMark className="h-4 w-4" />
              </span>
              <span className="text-[9px] uppercase leading-[1.5] tracking-[0.14em] text-forest/70">
                Small batch<br />Packed by hand
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-[106px]">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-[1.3rem] text-forest">Refine</h2>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={reset}
                      className="text-[8.5px] uppercase tracking-[0.14em] text-burgundy hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {filterContent}
              </div>
            </aside>

            <div>
              <div className="flex flex-col gap-3 border-b border-forest/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-charcoal/45">
                  Showing <span className="text-forest">{filtered.length}</span> of {products.length}
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/35" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search the pantry"
                      aria-label="Search products"
                      className="h-10 w-full rounded-full border border-forest/15 bg-cream/50 pl-9 pr-4 text-[11px] text-charcoal placeholder:text-charcoal/35 focus:border-gold focus:outline-none sm:w-[205px]"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      aria-label="Sort products"
                      className="h-10 appearance-none rounded-full border border-forest/15 bg-cream/50 pl-4 pr-9 text-[10px] uppercase tracking-[0.08em] text-forest focus:border-gold focus:outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-forest/50" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                    className="relative flex h-10 items-center gap-2 rounded-full border border-forest/15 px-4 text-[9px] uppercase tracking-[0.14em] text-forest lg:hidden"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeCount > 0 && (
                      <span className="grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[8px] text-ivory">
                        {activeCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {(category !== "all" || types.length > 0 || benefits.length > 0) && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {category !== "all" && (
                    <button
                      type="button"
                      onClick={() => setCategory("all")}
                      className="flex items-center gap-1.5 rounded-full bg-sage/60 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.08em] text-forest"
                    >
                      {categories.find((item) => item.id === category)?.name}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {[...types, ...benefits].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (types.includes(item)) toggle(item, types, setTypes);
                        else toggle(item, benefits, setBenefits);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-sage/60 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.08em] text-forest"
                    >
                      {item}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                  {filtered.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onQuickView={setQuickView}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/15 bg-cream/40 px-6 py-20 text-center">
                  <LeafMark className="h-12 w-12 text-forest/30" />
                  <h3 className="mt-5 font-serif text-2xl text-forest">Nothing in this corner yet</h3>
                  <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-charcoal/50">
                    Try a different collection or clear your filters — the pantry is small and
                    carefully chosen.
                  </p>
                  <button type="button" onClick={reset} className="btn btn-secondary btn-sm mt-5">
                    <span>Clear filters</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <p className="mt-10 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-charcoal/35">
                <LeafMark className="h-3.5 w-3.5 text-gold" />
                Every pouch sealed for freshness · Free shipping over ₹999
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-forest/45 backdrop-blur-[2px]"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-ivory p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-forest">Refine your pantry</h2>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                  className="grid h-9 w-9 place-items-center rounded-full border border-forest/15"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {filterContent}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={reset} className="btn btn-secondary btn-sm flex-1">
                  <span>Clear all</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="btn btn-primary btn-sm flex-1"
                >
                  <span>Show {filtered.length} products</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
