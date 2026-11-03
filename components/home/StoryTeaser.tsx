import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { LeafMark } from "@/components/ui/Botanical";

export function StoryTeaser() {
  return (
    <section className="relative overflow-hidden bg-cream section-pad">
      <div className="editorial-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
            <div className="absolute left-0 top-0 h-[88%] w-[86%] overflow-hidden rounded-t-[200px] rounded-b-2xl border border-gold/25">
              <ParallaxImage
                src="/images/about-ingredients.jpg"
                alt="Fresh produce and ingredients being prepared in the Tasty Treasures studio"
                className="absolute inset-0 overflow-hidden"
                sizes="(max-width: 1024px) 90vw, 42vw"
                strength={26}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/35 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-[55%] rounded-xl border border-gold/30 bg-ivory p-5 shadow-lift">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40">
                <LeafMark className="h-5 w-5 text-forest" />
              </span>
              <p className="mt-3 font-serif text-[1.15rem] leading-tight text-forest">
                Nothing added.
                <br />
                Nothing rushed.
              </p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-charcoal/40">
                Our everyday promise
              </p>
            </div>
            <div className="absolute -left-3 top-1/3 hidden h-20 w-20 rotate-[-8deg] rounded-full border border-gold/30 bg-cream p-3 shadow-soft sm:block">
              <p className="text-center text-[6.5px] uppercase leading-[1.6] tracking-[0.18em] text-forest/60">
                Small batch · India
              </p>
            </div>
          </div>
        </Reveal>

        <div className="order-1 max-w-xl lg:order-2">
          <Reveal>
            <span className="eyebrow">Our story</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(2.3rem,4.4vw,3.9rem)] leading-[0.99] text-forest">
              A pantry built on
              <br />
              <span className="italic text-burgundy">patience.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[13px] leading-[1.9] text-charcoal/65">
              Tasty Treasures began with a season of very good strawberries and a simple
              question: how do you keep this? Not in syrup or sugar, but as close to the fruit
              itself as possible. Freeze-drying gave us the answer — and a way of working that
              we still follow today.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <blockquote className="mt-7 border-l border-gold/50 pl-6">
              <p className="script text-[1.75rem] leading-tight text-burgundy/85">
                “The shortest ingredient list wins.”
              </p>
              <footer className="mt-2 text-[8.5px] uppercase tracking-[0.2em] text-charcoal/40">
                The Tasty Treasures studio
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/about" className="btn btn-secondary group mt-8">
              <span>Read our story</span>
              <ArrowRight className="arrow-slide h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
