import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { accentStyles, FruitGlyph } from "@/components/ui/Botanical";

type Props = {
  product: Pick<Product, "name" | "theme" | "accent" | "packs" | "image">;
  view?: "front" | "detail" | "ingredients";
  className?: string;
  compact?: boolean;
  priority?: boolean;
};

export function ProductArt({ product, view = "front", className, compact = false }: Props) {
  const accent = accentStyles[product.accent];
  const pack = product.packs[0];

  if (product.image) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  if (view === "ingredients") {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#FFFDF5_0%,#F4F0E5_60%,#E8E1CE_100%)]",
          className,
        )}
      >
        <div className="absolute inset-6 rounded-full border border-gold/30" />
        <div className="absolute inset-12 rounded-full border border-dashed border-forest/15" />
        <div className={cn("relative", compact ? "h-24 w-24" : "h-[46%] w-[46%]")}>
          <FruitGlyph theme={product.theme} />
        </div>
        <span className="absolute bottom-5 left-0 right-0 text-center text-[8px] uppercase tracking-[0.35em] text-forest/55">
          Ingredient study
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        "bg-[radial-gradient(ellipse_at_50%_42%,#FFFDF5_0%,#F4F0E5_58%,#E9E2D0_100%)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-8 bottom-8 rounded-[50%] border border-gold/20" />
      <div className="pointer-events-none absolute -left-10 top-1/4 h-28 w-28 rounded-full bg-sage/50 blur-2xl" />
      <div className="pointer-events-none absolute -right-6 bottom-10 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />

      {!compact && (
        <>
          <div
            className="absolute left-[11%] top-[16%] h-[13%] w-[13%] rotate-[-12deg] rounded-full border border-white/70 shadow-soft"
            style={{ backgroundColor: "#FFFDF5" }}
          >
            <div className="h-full w-full scale-75 p-1">
              <FruitGlyph theme={product.theme} />
            </div>
          </div>
          <div className="absolute right-[9%] top-[24%] h-[10%] w-[10%] rotate-[14deg] rounded-full border border-white/70 bg-ivory shadow-soft">
            <div className="h-full w-full scale-75 p-1">
              <FruitGlyph theme={product.theme} />
            </div>
          </div>
          <div className="absolute bottom-[18%] right-[13%] h-[8%] w-[8%] rotate-[-8deg] rounded-full border border-white/70 bg-ivory shadow-soft">
            <div className="h-full w-full scale-75 p-1">
              <FruitGlyph theme={product.theme} />
            </div>
          </div>
        </>
      )}

      <div
        className={cn(
          "relative z-10 transition-transform duration-[900ms] ease-premium",
          compact ? "w-[44%]" : view === "detail" ? "w-[64%]" : "w-[48%]",
        )}
        style={{ transform: view === "detail" ? "rotate(-4deg) translateY(2%) scale(1.08)" : undefined }}
      >
        <div className="absolute -bottom-3 left-1/2 h-4 w-[82%] -translate-x-1/2 rounded-[50%] bg-forest/20 blur-md" />
        <div
          className={cn(
            "relative aspect-[3/4.1] w-full bg-gradient-to-br text-ivory shadow-[0_28px_45px_-18px_rgba(16,63,37,0.55)]",
            accent.body,
          )}
          style={{
            clipPath:
              "polygon(6% 0%, 94% 0%, 100% 4%, 100% 94%, 96% 100%, 4% 100%, 0% 94%, 0% 4%)",
            borderRadius: "14px 14px 10px 10px",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[5%] opacity-90"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,253,245,0.5) 0 2px, rgba(255,253,245,0.14) 2px 5px)",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-[6%] opacity-40"
            style={{ background: `linear-gradient(90deg, ${accent.spine}, transparent)` }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[8%] opacity-30"
            style={{ background: `linear-gradient(270deg, ${accent.spine}, transparent)` }}
          />

          <div className="absolute inset-x-[10%] top-[20%] bottom-[13%] flex flex-col rounded-[5px] border border-white/25 bg-[#F8F3E6] px-[9%] py-[8%] text-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="flex items-center justify-between gap-1">
              <span
                className="font-serif text-[clamp(7px,1.05vw,12px)] uppercase leading-none tracking-[0.12em]"
                style={{ color: accent.spine }}
              >
                Tasty
              </span>
              <span
                className="h-[1px] flex-1 opacity-40"
                style={{ backgroundColor: accent.spine }}
              />
              <span className="text-[clamp(4px,0.55vw,7px)] uppercase tracking-[0.24em] text-forest/60">
                Treasures
              </span>
            </div>

            <div className="my-auto flex flex-col items-center gap-[6%] py-[7%]">
              <div className="h-[36%] w-[46%] min-h-9">
                <FruitGlyph theme={product.theme} />
              </div>
              <div className="text-center">
                <p className="font-serif text-[clamp(9px,1.6vw,19px)] leading-[1.02] text-forest">
                  {product.name}
                </p>
                <p
                  className="mt-1.5 text-[clamp(4px,0.55vw,7px)] uppercase tracking-[0.18em]"
                  style={{ color: accent.spine, opacity: 0.7 }}
                >
                  {product.theme === "moringa"
                    ? "Shade-dried · Stone-milled"
                    : product.theme === "powder"
                      ? "Single ingredient"
                      : "Freeze-dried · Never fried"}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between gap-1 border-t pt-[5%]" style={{ borderColor: `${accent.spine}33` }}>
              <span className="text-[clamp(4px,0.55vw,7px)] uppercase tracking-[0.2em] text-forest/60">
                {pack?.grams ? `${pack.grams} g` : "Gift box"}
              </span>
              <span className="flex items-center gap-1 text-[clamp(4px,0.5vw,6px)] uppercase tracking-[0.14em] text-forest/60">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accent.seal }}
                />
                Small batch
              </span>
            </div>
          </div>

          <div className="absolute inset-x-[20%] bottom-[4%] h-[3%] rounded-full bg-black/20 blur-[2px]" />
        </div>
        <div className="absolute -right-[6%] top-[14%] flex h-8 w-8 rotate-12 items-center justify-center rounded-full border border-gold/60 bg-ivory text-[5px] font-medium uppercase leading-[1.3] tracking-[0.1em] text-forest shadow-soft">
          100%
          <br />
          real
        </div>
      </div>
    </div>
  );
}

export function ProductThumb({
  product,
  className,
}: {
  product: Pick<Product, "name" | "theme" | "accent" | "packs" | "image">;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg bg-cream", className)}>
      <ProductArt product={product} compact />
    </div>
  );
}
