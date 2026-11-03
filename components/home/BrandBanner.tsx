import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, GoldRule } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { LeafMark, GoldSprig } from "@/components/ui/Botanical";
import { LineIcon } from "@/components/ui/Icons";

const pillars = [
  { icon: "heart" as const, title: "Made with Care", text: "Checked and packed by hand" },
  { icon: "seal" as const, title: "Premium Quality", text: "Small batches, closely watched" },
  { icon: "leaf" as const, title: "Trusted by Families", text: "Everyday food, honestly made" },
  { icon: "recycle" as const, title: "Good for You & Nature", text: "Seasonal, light and considered" },
];

export function BrandBanner() {
  return (
    <section className="relative overflow-hidden bg-forest text-ivory">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 order-2 flex flex-col justify-center px-5 py-16 sm:px-10 lg:order-1 lg:py-24 lg:pl-[max(2rem,calc((100vw-1480px)/2+4.75rem))] lg:pr-16">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0 [background-image:radial-gradient(#B49A58_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>
          <div className="relative max-w-xl">
            <Reveal>
              <span className="eyebrow text-gold">The Tasty promise</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[0.94] tracking-[-0.02em]">
                From nature
                <br />
                to your <span className="italic text-gold">table.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="script mt-5 text-[2rem] leading-none text-gold/90">
                Real food. Real nutrition. Real good.
              </p>
            </Reveal>
            <GoldRule className="mt-7 w-28" delay={0.25} />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-[12.5px] leading-[1.85] text-ivory/60">
                We believe good food should be simple to understand and a pleasure to eat.
                That means real ingredients, a gentle process and a pantry you can trust —
                one handful at a time.
              </p>
            </Reveal>

            <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-6">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={0.25 + index * 0.06} y={16}>
                  <div className="group flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/35 text-gold transition-colors group-hover:border-gold group-hover:bg-gold/10">
                      <LineIcon name={pillar.icon} className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-ivory/90">
                        {pillar.title}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-ivory/40">{pillar.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.45}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/about" className="btn btn-gold group">
                  <span>Our story</span>
                  <ArrowRight className="arrow-slide h-4 w-4" />
                </Link>
                <Link
                  href="/process"
                  className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ivory/65 transition-colors hover:text-ivory"
                >
                  How we preserve it
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="relative order-1 min-h-[340px] overflow-hidden lg:order-2 lg:min-h-[680px]">
          <ParallaxImage
            src="/images/brand-basket.jpg"
            alt="A woven basket filled with freeze-dried fruit and natural ingredients"
            className="absolute inset-0 overflow-hidden"
            sizes="(max-width: 1024px) 100vw, 48vw"
            strength={34}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/25 to-transparent lg:via-forest/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-forest/20 lg:from-forest/30" />
          <div className="absolute inset-6 rounded-lg border border-ivory/15 lg:inset-10" />
          <div className="absolute bottom-8 right-8 hidden h-24 w-24 place-items-center rounded-full border border-gold/40 bg-forest/40 backdrop-blur-sm sm:grid">
            <div className="text-center">
              <LeafMark className="mx-auto h-8 w-8 text-gold" />
              <span className="mt-1 block text-[6px] uppercase tracking-[0.2em] text-ivory/65">
                Est. with care
              </span>
            </div>
          </div>
          <GoldSprig className="absolute -bottom-6 left-8 h-40 w-24 text-gold/35 lg:left-14" />
        </div>
      </div>
    </section>
  );
}
