"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle, Search, Sparkles } from "lucide-react";
import { faqs } from "@/lib/content";
import { useSite } from "@/components/providers/SiteProvider";
import { cn, waLink } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(faqs.map((item) => item.category)))];

export function FaqAccordion() {
  const site = useSite();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(faqs[0]?.question ?? null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return faqs.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (
        search &&
        !`${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [category, query]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
      <div>
        <div className="flex flex-col gap-4 border-b border-forest/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[9px] uppercase tracking-[0.12em] transition-colors",
                  category === item
                    ? "border-forest bg-forest text-ivory"
                    : "border-forest/15 text-charcoal/60 hover:border-gold hover:text-forest",
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="relative shrink-0">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              aria-label="Search frequently asked questions"
              className="h-10 w-full rounded-full border border-forest/15 bg-cream/40 pl-9 pr-4 text-[11px] text-charcoal placeholder:text-charcoal/35 focus:border-gold focus:outline-none sm:w-[200px]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-forest/15 bg-cream/40 px-6 py-16 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gold/60" />
            <h3 className="mt-4 font-serif text-2xl text-forest">No answer for that yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-charcoal/50">
              Try a different word, or send the question straight to the studio — we are happy
              to help.
            </p>
            <a
              href={waLink(site.whatsapp, "Hi Tasty Treasures! I have a question that isn't in the FAQ.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm mt-5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="mt-2 divide-y divide-forest/10">
            {filtered.map((item) => {
              const isOpen = open === item.question;
              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.question)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${encodeURIComponent(item.question)}`}
                      className="flex w-full items-start justify-between gap-5 py-5 text-left"
                    >
                      <span>
                        <span className="block text-[8px] uppercase tracking-[0.18em] text-gold">
                          {item.category}
                        </span>
                        <span className="mt-1.5 block font-serif text-[1.15rem] leading-snug text-forest">
                          {item.question}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "rotate-180 border-forest bg-forest text-ivory"
                            : "border-forest/15 text-forest/60",
                        )}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${encodeURIComponent(item.question)}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 pr-10 text-[12px] leading-[1.9] text-charcoal/60">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-xl border border-gold/30 bg-forest p-6 text-ivory">
          <p className="script text-[1.75rem] leading-none text-gold">Still curious?</p>
          <p className="mt-2 text-[12px] leading-[1.8] text-ivory/65">
            The studio answers messages personally, usually within one working day. Ask about an
            ingredient, an order or a bulk enquiry.
          </p>
          <a
            href={waLink(site.whatsapp, "Hi Tasty Treasures! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold btn-sm mt-5 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message the studio</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-center text-[9px] uppercase tracking-[0.14em] text-ivory/45 hover:text-ivory"
          >
            {site.email}
          </a>
        </div>

        <div className="rounded-xl border border-forest/10 bg-cream/50 p-5">
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">A note on wellness</p>
          <p className="mt-2 text-[10.5px] leading-[1.75] text-charcoal/50">
            Our products are foods, not medicine. Nutrition information is indicative and varies
            with the harvest. If you have an allergy or medical condition, please read the
            ingredient list and speak with your healthcare professional.
          </p>
        </div>

        <div className="rounded-xl border border-forest/10 bg-ivory p-5">
          <p className="font-serif text-[1.05rem] text-forest">Looking for a policy?</p>
          <div className="mt-3 grid gap-2 text-[10px] uppercase tracking-[0.12em] text-charcoal/55">
            <a href="/policies/shipping" className="hover:text-burgundy">Shipping policy</a>
            <a href="/policies/returns" className="hover:text-burgundy">Return policy</a>
            <a href="/policies/privacy" className="hover:text-burgundy">Privacy policy</a>
            <a href="/policies/terms" className="hover:text-burgundy">Terms &amp; conditions</a>
          </div>
        </div>
      </aside>
    </div>
  );
}
