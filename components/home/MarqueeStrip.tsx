import { LeafMark } from "@/components/ui/Botanical";

const items = [
  "Freeze-dried, never fried",
  "No added preservatives",
  "Real fruit, real crunch",
  "Packed by hand in small batches",
  "Ships across India",
];

export function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden border-y border-gold/25 bg-cream py-3.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max animate-marquee items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="px-7 text-[8.5px] font-medium uppercase tracking-[0.26em] text-forest/60">
                  {item}
                </span>
                <LeafMark className="h-3 w-3 shrink-0 text-gold/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
