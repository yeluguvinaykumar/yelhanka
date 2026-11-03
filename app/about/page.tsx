import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/store";
import { journeySteps, values, comparisonPoints } from "@/lib/content";
import { Reveal, GoldRule } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { LineIcon } from "@/components/ui/Icons";
import { LeafMark, BotanicalCorner, GoldSprig } from "@/components/ui/Botanical";
import { StatRibbon } from "@/components/about/StatRibbon";

export const metadata: Metadata = {
  title: "Our Story & Promise",
  description:
    "Tasty Treasures is a small natural food studio preserving fruit, vegetables and leaves through freeze-drying. Read our story, values and promises.",
};

export default async function AboutPage() {
  const content = await getContent();
  const { about } = content;

  return (
    <>
      <section className="paper relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <BotanicalCorner className="absolute -left-10 bottom-0 h-64 w-64 text-forest/20" />
          <BotanicalCorner className="absolute -right-8 top-8 h-52 w-52 rotate-90 text-gold/25" />
          <div className="absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-sage/40 blur-3xl" />
        </div>
        <div className="editorial-container relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40">
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <span className="text-forest">About</span>
          </nav>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="eyebrow">About us</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 font-serif text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.9] tracking-[-0.035em] text-forest">
                  Our story,
                  <br />
                  <span className="italic text-burgundy">our promise.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-lg text-[13px] leading-[1.9] text-charcoal/65">
                  {about.story}
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-forest/10 py-4 text-[9px] uppercase tracking-[0.16em] text-charcoal/45">
                  <span className="flex items-center gap-2">
                    <LeafMark className="h-4 w-4 text-gold" />
                    Small-batch studio
                  </span>
                  <span className="flex items-center gap-2">
                    <LeafMark className="h-4 w-4 text-gold" />
                    Fruit, vegetables, leaves
                  </span>
                  <span className="flex items-center gap-2">
                    <LeafMark className="h-4 w-4 text-gold" />
                    Packed by hand
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn btn-primary group">
                    <span>Explore the pantry</span>
                    <ArrowRight className="arrow-slide h-4 w-4" />
                  </Link>
                  <Link href="/process" className="btn btn-secondary">
                    <span>Our process</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="relative">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[500px]">
                <div className="absolute right-0 top-0 h-[90%] w-[84%] overflow-hidden rounded-t-[220px] rounded-b-2xl border border-gold/30">
                  <ParallaxImage
                    src="/images/about-ingredients.jpg"
                    alt="Fresh ingredients arranged in the Tasty Treasures studio"
                    className="absolute inset-0 overflow-hidden"
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    strength={30}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
                  <div className="absolute inset-4 rounded-t-[190px] rounded-b-xl border border-ivory/20" />
                </div>
                <div className="absolute bottom-4 left-0 w-[56%] overflow-hidden rounded-xl border border-gold/30 bg-ivory p-3 shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src="/images/hero-fruits.jpg"
                      alt="Freeze-dried strawberries"
                      fill
                      sizes="30vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-1 pb-1 pt-3">
                    <span className="text-[7.5px] uppercase tracking-[0.14em] text-charcoal/45">
                      At the studio
                    </span>
                    <LeafMark className="h-4 w-4 text-forest/50" />
                  </div>
                </div>
                <div className="absolute -right-3 top-[12%] grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream/95 shadow-soft">
                  <div className="text-center">
                    <p className="script text-[1.55rem] leading-none text-burgundy">Since</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-forest/60">
                      the first<br />harvest
                    </p>
                  </div>
                </div>
                <GoldSprig className="absolute -bottom-6 right-2 h-32 w-20 text-gold/40" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-ivory section-pad">
        <div className="editorial-container">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr_0.9fr] lg:gap-12">
            <div>
              <Reveal>
                <span className="eyebrow">Our journey</span>
                <h2 className="mt-4 font-serif text-[clamp(2.1rem,3.4vw,3rem)] leading-[1] text-forest">
                  A slow beginning,
                  <br />
                  <span className="italic text-burgundy">a careful pantry.</span>
                </h2>
              </Reveal>
              <div className="mt-7 space-y-6">
                {journeySteps.map((step, index) => (
                  <Reveal key={step.year} delay={0.1 + index * 0.08}>
                    <div className="border-l border-gold/40 pl-5">
                      <p className="text-[8px] uppercase tracking-[0.22em] text-gold">{step.year}</p>
                      <h3 className="mt-1.5 font-serif text-[1.15rem] text-forest">{step.title}</h3>
                      <p className="mt-1.5 text-[11.5px] leading-[1.75] text-charcoal/55">{step.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.12} className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gold/25 lg:mt-6">
                <ParallaxImage
                  src="/images/category-fruits.jpg"
                  alt="Fresh produce selected for freeze-drying"
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 90vw, 35vw"
                  strength={22}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
                <div className="absolute inset-4 rounded-lg border border-ivory/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="script text-[1.8rem] leading-none text-ivory">Picked with intent.</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-ivory/60">
                    Selection · Wash · Preparation
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col justify-center gap-7">
              <Reveal delay={0.08}>
                <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Our mission</p>
                <p className="mt-3 font-serif text-[1.35rem] leading-[1.4] text-forest">{about.mission}</p>
              </Reveal>
              <GoldRule className="w-24" delay={0.2} />
              <Reveal delay={0.18}>
                <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Our vision</p>
                <p className="mt-3 text-[12px] leading-[1.85] text-charcoal/60">{about.vision}</p>
              </Reveal>
              <Reveal delay={0.26}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-b border-forest/25 pb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-forest hover:border-gold"
                >
                  Come say hello
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="paper section-pad">
        <div className="editorial-container">
          <SectionHeading
            eyebrow="What we stand for"
            title={
              <>
                Five values we <span className="italic text-burgundy">keep.</span>
              </>
            }
            description="Not a poster on the wall — decisions made daily, from the produce we buy to the pouch we seal."
            align="center"
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06} y={20}>
                <div className="group relative flex h-full flex-col rounded-xl border border-forest/10 bg-ivory p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:bg-sage/30 hover:shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-forest/15 text-forest transition-all duration-500 group-hover:border-gold group-hover:text-burgundy">
                    <LineIcon name={value.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-[1.2rem] text-forest">{value.title}</h3>
                  <p className="mt-1.5 text-[10.5px] leading-[1.7] text-charcoal/55">{value.short}</p>
                  <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-48 group-hover:opacity-100 max-lg:max-h-48 max-lg:opacity-100">
                    <p className="border-t border-forest/10 pt-3 text-[10px] leading-[1.7] text-charcoal/50">
                      {value.long}
                    </p>
                  </div>
                  <span className="mt-auto pt-4 font-serif text-[10px] text-gold/60">0{index + 1}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad">
        <div className="editorial-container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr_0.95fr] lg:gap-10">
          <div>
            <Reveal>
              <span className="eyebrow">Why Tasty Treasures</span>
              <h2 className="mt-4 font-serif text-[clamp(2.2rem,3.8vw,3.4rem)] leading-[0.98] text-forest">
                A shorter list.
                <br />
                <span className="italic text-burgundy">A better bite.</span>
              </h2>
              <p className="mt-5 text-[12px] leading-[1.85] text-charcoal/55">
                Most snacks ask you to read a long label. We would rather you recognise every
                ingredient on ours. That is the whole idea.
              </p>
            </Reveal>
          </div>

          <div className="space-y-5">
            {comparisonPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.07}>
                <div className="group flex gap-4 border-b border-forest/10 pb-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-[9px] text-gold transition-colors group-hover:bg-gold group-hover:text-forest">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.05rem] text-forest">{point.title}</h3>
                    <p className="mt-1 text-[10.5px] leading-[1.7] text-charcoal/50">{point.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[180px] rounded-b-xl border border-gold/30">
              <ParallaxImage
                src="/images/category-chips.jpg"
                alt="An overhead spread of natural ingredients"
                className="absolute inset-0"
                sizes="(max-width: 1024px) 90vw, 30vw"
                strength={20}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/35 to-transparent" />
              <div className="absolute inset-4 rounded-t-[160px] rounded-b-lg border border-ivory/20" />
              <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-ivory/20 bg-forest/35 px-4 py-3 backdrop-blur">
                <p className="text-[8px] uppercase tracking-[0.2em] text-ivory/60">Our daily check</p>
                <p className="mt-1 font-serif text-[16px] text-ivory">Good enough for our own table.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <StatRibbon stats={content.stats} />

      <section className="relative overflow-hidden bg-cream section-pad">
        <div className="editorial-container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <span className="eyebrow">Thank you</span>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.4vw,4.8rem)] uppercase leading-[0.92] tracking-[-0.025em] text-forest">
              From nature
              <br />
              to your <span className="italic text-burgundy">table.</span>
            </h2>
            <p className="script mt-4 text-[2rem] leading-none text-burgundy/80">
              Thank you for being part of our journey!
            </p>
            <p className="mt-5 max-w-md text-[12.5px] leading-[1.85] text-charcoal/55">
              Every order is packed by a small team that cares about the details. If something
              isn&apos;t right, tell us — we will make it right.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary group">
                <span>Find your favourite</span>
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                <span>Talk to the studio</span>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl border border-gold/30">
              <ParallaxImage
                src="/images/brand-basket.jpg"
                alt="A basket of natural food and dried fruit"
                className="absolute inset-0"
                sizes="(max-width: 1024px) 90vw, 40vw"
                strength={24}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/45 to-transparent" />
              <div className="absolute inset-4 rounded-lg border border-ivory/20" />
            </div>
            <div className="absolute -bottom-5 -left-4 grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-ivory shadow-soft sm:-left-6">
              <LeafMark className="h-9 w-9 text-forest" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
