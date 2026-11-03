import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, Snowflake, Thermometer, Timer } from "lucide-react";
import { processComparison, processSteps, benefits } from "@/lib/content";
import { Reveal, GoldRule } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { LineIcon } from "@/components/ui/Icons";
import { BotanicalCorner, GoldSprig, LeafMark } from "@/components/ui/Botanical";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Freeze-Drying Process",
  description:
    "Seven gentle steps from harvest to pouch. Learn how freeze-drying works, why it protects colour, shape and flavour, and how it differs from conventional dehydration.",
};

const facts = [
  { icon: Thermometer, label: "Low temperature", detail: "No sustained heat" },
  { icon: Snowflake, label: "Sublimation", detail: "Ice becomes vapour" },
  { icon: Timer, label: "Slow by design", detail: "Small batches only" },
];

const protection = benefits.slice(0, 4);

export default function ProcessPage() {
  return (
    <>
      <section className="paper relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <BotanicalCorner className="absolute -left-10 bottom-0 h-64 w-64 text-forest/20" />
          <BotanicalCorner className="absolute -right-8 top-8 h-52 w-52 rotate-90 text-gold/25" />
          <div className="absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-sage/40 blur-3xl" />
        </div>

        <div className="editorial-container relative">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-forest">About</Link>
            <span>/</span>
            <span className="text-forest">Our process</span>
          </nav>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="eyebrow">Our process</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 font-serif text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.9] tracking-[-0.035em] text-forest">
                  The slow art of
                  <br />
                  <span className="italic text-burgundy">keeping flavour.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="script mt-3 text-[1.9rem] leading-none text-burgundy/80">
                  Seven gentle steps. No shortcuts.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-lg text-[13px] leading-[1.9] text-charcoal/65">
                  Freeze-drying is a preservation method, not a recipe trick. We freeze fruit
                  and vegetables at their peak, lower the pressure, and let the water leave as
                  vapour. What remains is the ingredient — bright, crisp and close to how it
                  began.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-7 grid max-w-lg grid-cols-3 gap-3 border-y border-forest/10 py-5">
                  {facts.map(({ icon: Icon, label, detail }) => (
                    <div key={label}>
                      <Icon className="h-4 w-4 text-gold" strokeWidth={1.4} />
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-forest">
                        {label}
                      </p>
                      <p className="mt-0.5 text-[9.5px] leading-snug text-charcoal/45">{detail}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.28}>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn btn-primary group">
                    <span>Taste the difference</span>
                    <ArrowRight className="arrow-slide h-4 w-4" />
                  </Link>
                  <Link href="/about" className="btn btn-secondary">
                    <span>Our story</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="relative">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[500px]">
                <div className="absolute inset-x-0 top-0 h-[90%] overflow-hidden rounded-t-[220px] rounded-b-2xl border border-gold/30">
                  <ParallaxImage
                    src="/images/process-lab.jpg"
                    alt="Fresh produce being prepared for freeze-drying at the Tasty Treasures studio"
                    className="absolute inset-0 overflow-hidden"
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    strength={30}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/10 to-transparent" />
                  <div className="absolute inset-4 rounded-t-[190px] rounded-b-xl border border-ivory/20" />
                  <div className="absolute bottom-7 left-7 right-7 text-ivory">
                    <p className="text-[8px] uppercase tracking-[0.24em] text-ivory/65">
                      The drying room
                    </p>
                    <p className="mt-1 font-serif text-[20px] leading-tight">
                      Low temperature. Patient work.
                    </p>
                  </div>
                </div>
                <div className="absolute -right-3 top-[12%] grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream/95 text-center shadow-soft">
                  <div>
                    <p className="script text-[1.55rem] leading-none text-burgundy">Seven</p>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-forest/60">
                      gentle steps
                    </p>
                  </div>
                </div>
                <GoldSprig className="absolute -bottom-5 right-2 h-32 w-20 text-gold/40" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest text-ivory section-pad">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full border border-gold" />
          <div className="absolute -bottom-24 -left-20 h-[380px] w-[380px] rounded-full border border-gold" />
        </div>
        <div className="editorial-container relative">
          <SectionHeading
            eyebrow="Freeze-dried vs dehydrated"
            title={
              <>
                Why the process <span className="italic text-gold">matters.</span>
              </>
            }
            description="Both methods remove water. How the water leaves changes what stays behind — the texture, the colour and the character of the ingredient."
            light
            align="center"
          />

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-ivory/15 bg-ivory/[0.04]">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-ivory/[0.05] text-[8px] uppercase tracking-[0.16em] text-ivory/50 sm:text-[9px]">
              <div className="px-4 py-4 sm:px-6">What changes</div>
              <div className="border-l border-ivory/10 px-4 py-4 sm:px-6">
                <span className="text-gold">Freeze-dried</span>
              </div>
              <div className="border-l border-ivory/10 px-4 py-4 sm:px-6">Dehydrated</div>
            </div>
            {processComparison.map((row, index) => (
              <Reveal key={row.label} delay={index * 0.05}>
                <div
                  className={cn(
                    "grid grid-cols-[1.1fr_1fr_1fr] border-t border-ivory/10 text-[10px] leading-relaxed sm:text-[11.5px]",
                    index % 2 === 1 && "bg-ivory/[0.02]",
                  )}
                >
                  <div className="px-4 py-4 font-medium text-ivory/75 sm:px-6">{row.label}</div>
                  <div className="flex gap-2 border-l border-ivory/10 px-4 py-4 text-ivory/70 sm:px-6">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold" strokeWidth={2} />
                    {row.freeze}
                  </div>
                  <div className="border-l border-ivory/10 px-4 py-4 text-ivory/45 sm:px-6">
                    {row.dehydrate}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-[10px] leading-relaxed text-ivory/35">
            The comparison above describes the general behaviour of each method. Actual results
            vary with the produce, cut size and drying programme.
          </p>
        </div>
      </section>

      <section className="paper section-pad">
        <div className="editorial-container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="self-start lg:sticky lg:top-28">
            <Reveal>
              <span className="eyebrow">Harvest to pouch</span>
              <h2 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.98] text-forest">
                Seven steps,
                <br />
                <span className="italic text-burgundy">one honest pouch.</span>
              </h2>
              <p className="mt-5 max-w-sm text-[12px] leading-[1.85] text-charcoal/55">
                Every batch moves through the same sequence. The details change with the
                ingredient; the care does not.
              </p>
            </Reveal>
            <GoldRule className="mt-7 w-28" />
            <Reveal delay={0.12}>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-xl border border-gold/25">
                <Image
                  src="/images/about-ingredients.jpg"
                  alt="Ingredients being selected and prepared by hand"
                  fill
                  sizes="(max-width: 1024px) 90vw, 32vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/45 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-ivory/80">
                  <LeafMark className="h-4 w-4 text-gold" />
                  Checked by hand at every stage
                </div>
              </div>
            </Reveal>
          </div>

          <ol className="relative border-l border-gold/30 pl-8 sm:pl-11">
            {processSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.04}>
                <li className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[49px] top-0 grid h-8 w-8 place-items-center rounded-full border border-gold/50 bg-cream text-[8px] font-semibold tracking-[0.08em] text-forest sm:-left-[58px] sm:h-9 sm:w-9">
                    {step.number}
                  </span>
                  <div className="rounded-xl border border-forest/10 bg-ivory p-5 transition-colors duration-500 hover:border-gold/50 sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-forest/15 text-forest">
                        <LineIcon name={step.icon} className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[7.5px] uppercase tracking-[0.22em] text-gold">
                          Step {step.number}
                        </p>
                        <h3 className="mt-1 font-serif text-[1.35rem] leading-tight text-forest">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] leading-[1.85] text-charcoal/60">
                      {step.description}
                    </p>
                    <p className="mt-3 flex items-start gap-2 border-t border-forest/8 pt-3 text-[10.5px] leading-relaxed text-charcoal/45">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {step.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-ivory section-pad">
        <div className="editorial-container">
          <SectionHeading
            eyebrow="What the process protects"
            title={
              <>
                Nature does the <span className="italic text-burgundy">flavouring.</span>
              </>
            }
            description="A gentle process is only useful if it protects what was already good. These are the qualities we look for in every batch."
            align="center"
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {protection.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} y={20}>
                <div className="group flex h-full flex-col rounded-xl border border-forest/10 bg-cream/40 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:bg-sage/30 hover:shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-forest/15 text-forest transition-colors group-hover:border-gold group-hover:text-burgundy">
                    <LineIcon name={item.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-[1.2rem] text-forest">{item.title}</h3>
                  <p className="mt-1.5 text-[10.5px] leading-[1.7] text-charcoal/55">
                    {item.description}
                  </p>
                  <span className="mt-auto pt-4 font-serif text-[10px] text-gold/60">
                    0{index + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream section-pad">
        <div className="editorial-container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <span className="eyebrow">Taste it for yourself</span>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.2vw,4.6rem)] uppercase leading-[0.92] tracking-[-0.025em] text-forest">
              From fresh
              <br />
              to your <span className="italic text-burgundy">pantry.</span>
            </h2>
            <p className="script mt-4 text-[2rem] leading-none text-burgundy/80">
              Goodness, kept beautifully.
            </p>
            <p className="mt-5 max-w-md text-[12.5px] leading-[1.85] text-charcoal/55">
              Start with a single-ingredient pouch or explore the full pantry. If you have a
              question about how something is made, the studio is one message away.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary group">
                <span>Explore the pantry</span>
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                <span>Ask us anything</span>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl border border-gold/30">
              <ParallaxImage
                src="/images/category-chips.jpg"
                alt="Crisp vegetable chips made without frying"
                className="absolute inset-0"
                sizes="(max-width: 1024px) 90vw, 40vw"
                strength={24}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/45 to-transparent" />
              <div className="absolute inset-4 rounded-lg border border-ivory/20" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3 text-ivory">
                <p className="font-serif text-[17px]">Never fried. Never rushed.</p>
                <LeafMark className="h-6 w-6 text-gold" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
