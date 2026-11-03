import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { LeafMark } from "@/components/ui/Botanical";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-sage/45 section-pad-sm">
      <div className="pointer-events-none absolute inset-0">
        <LeafMark className="absolute -left-16 top-0 h-72 w-72 text-forest/[0.05]" />
        <LeafMark className="absolute -right-20 bottom-0 h-80 w-80 rotate-180 text-forest/[0.04]" />
      </div>
      <div className="editorial-container relative">
        <div className="grid items-center gap-10 rounded-2xl border border-gold/25 bg-ivory/70 p-7 backdrop-blur-sm sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div>
            <Reveal>
              <span className="eyebrow">Notes from the pantry</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1] text-forest">
                A little goodness,
                <br />
                <span className="italic text-burgundy">delivered slowly.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-md text-[12px] leading-[1.8] text-charcoal/55">
                Seasonal drops, process notes and recipes worth keeping. One considered note
                a month — never noise.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <NewsletterForm variant="light" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
