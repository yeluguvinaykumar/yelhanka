import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GoldSprig } from "@/components/ui/Botanical";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-cream px-5 py-24 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-forest/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full border border-gold/15"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[8px] uppercase tracking-[0.3em] text-gold">A wrong turn in the pantry</p>
          <h1 className="mt-4 font-serif text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] text-forest">
            404
            <span className="mt-2 block text-[clamp(1.7rem,4vw,2.8rem)] italic text-botanical">
              This shelf is empty.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[12.5px] leading-[1.9] text-charcoal/55">
            The page you were looking for may have moved, sold out, or was never here at all. The
            good things are still close by — start from the shop or say hello.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn btn-primary">
              <span className="relative z-10 flex items-center gap-2">
                Browse the pantry
                <ArrowRight className="arrow-slide h-4 w-4" />
              </span>
            </Link>
            <Link href="/" className="btn btn-secondary">
              <span className="relative z-10">Back home</span>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-forest/10 pt-6 text-[10px] text-charcoal/45">
            <Search className="h-4 w-4 text-gold" strokeWidth={1.5} />
            Looking for something specific?{" "}
            <Link href="/contact" className="text-forest underline underline-offset-4 hover:text-burgundy">
              Ask the studio
            </Link>
          </div>
        </div>

        <div className="relative hidden justify-center lg:flex">
          <div className="relative grid aspect-square w-full max-w-sm place-items-center rounded-full border border-forest/10 bg-ivory/70">
            <div className="absolute inset-6 rounded-full border border-dashed border-gold/30" />
            <GoldSprig className="h-40 w-40 text-botanical/40" />
            <span className="absolute bottom-8 font-script text-[1.6rem] text-gold">
              nothing wasted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
