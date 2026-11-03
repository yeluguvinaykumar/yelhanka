import { Reveal, GoldRule } from "@/components/ui/Reveal";
import { LineIcon } from "@/components/ui/Icons";
import { benefits } from "@/lib/content";

export function BenefitsStrip() {
  return (
    <section className="relative border-b border-forest/10 bg-ivory">
      <div className="editorial-container section-pad-sm">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <Reveal>
            <span className="eyebrow">Why Tasty Treasures</span>
            <h2 className="mt-4 max-w-xl font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.02] text-forest">
              Goodness, in every <span className="italic text-burgundy">detail.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[300px] text-[12px] leading-[1.8] text-charcoal/55 sm:text-right">
              Five promises we keep from the first harvest to the last handful in the pouch.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-10">
          <GoldRule className="absolute left-0 right-0 top-[42px] hidden opacity-50 lg:block" delay={0.2} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={0.08 * index} y={20}>
                <div className="group relative h-full overflow-hidden rounded-xl border border-forest/10 bg-ivory p-5 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-gold/60 hover:bg-sage/40 hover:shadow-soft sm:p-6">
                  <div className="flex items-start justify-between">
                    <span className="relative z-10 grid h-[52px] w-[52px] place-items-center rounded-full border border-forest/15 bg-cream text-forest transition-all duration-500 group-hover:rotate-[-6deg] group-hover:border-gold group-hover:bg-ivory group-hover:text-burgundy">
                      <LineIcon
                        name={benefit.icon}
                        className="h-6 w-6 transition-transform duration-500 group-hover:scale-110"
                      />
                    </span>
                    <span className="font-serif text-[11px] text-gold/80">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-[1.25rem] text-forest">{benefit.title}</h3>
                  <p className="mt-2 text-[11px] leading-[1.65] text-charcoal/55">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
