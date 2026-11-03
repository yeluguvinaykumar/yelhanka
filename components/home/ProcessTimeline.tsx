"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { LineIcon } from "@/components/ui/Icons";
import { processSteps } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProcessTimeline({
  detailed = false,
}: {
  detailed?: boolean;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const step = processSteps[active];

  const go = (direction: number) => {
    setActive((current) => (current + direction + processSteps.length) % processSteps.length);
  };

  return (
    <section className="relative overflow-hidden bg-forest text-ivory section-pad">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-gold" />
        <div className="absolute -bottom-52 -left-32 h-[520px] w-[520px] rounded-full border border-gold" />
        <div className="absolute inset-0 [background-image:radial-gradient(#B49A58_1px,transparent_1px)] [background-size:38px_38px]" />
      </div>

      <div className="editorial-container relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow eyebrow-center text-gold">From fresh to forever</span>
          <h2 className="mt-5 font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.98] text-ivory">
            The freeze-drying <span className="italic text-gold">process.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[12.5px] leading-[1.8] text-ivory/60">
            Technology that helps preserve nature&apos;s goodness. Seven gentle steps — no
            fryer, no added preservatives, no shortcuts.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="no-scrollbar overflow-x-auto pb-2">
            <div className="relative flex min-w-[720px] items-start justify-between gap-0 px-2 lg:min-w-0">
              <div className="absolute left-[5%] right-[5%] top-[27px] h-px bg-ivory/15">
                <motion.div
                  className="h-px origin-left bg-gold"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: (active + 1) / processSteps.length }}
                  viewport={{ once: false }}
                  animate={{ scaleX: (active + 1) / processSteps.length }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {processSteps.map((item, index) => {
                const isActive = index === active;
                const isPast = index < active;
                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setActive(index)}
                    className="group relative z-10 flex w-[calc(100%/7)] flex-col items-center gap-3 px-1 text-center"
                    aria-pressed={isActive}
                    aria-label={`Step ${item.number}: ${item.title}`}
                  >
                    <span
                      className={cn(
                        "grid h-[54px] w-[54px] place-items-center rounded-full border transition-all duration-500",
                        isActive
                          ? "scale-110 border-gold bg-gold text-forest shadow-[0_0_0_6px_rgba(180,154,88,0.13)]"
                          : isPast
                            ? "border-gold/60 bg-forest text-gold"
                            : "border-ivory/20 bg-forest text-ivory/50 group-hover:border-ivory/50 group-hover:text-ivory",
                      )}
                    >
                      <LineIcon name={item.icon} className="h-6 w-6" />
                    </span>
                    <span
                      className={cn(
                        "text-[8px] uppercase leading-[1.5] tracking-[0.12em] transition-colors duration-300",
                        isActive ? "text-gold" : "text-ivory/40 group-hover:text-ivory/70",
                      )}
                    >
                      <span className="mb-0.5 block text-[7px] tracking-[0.2em]">{item.number}</span>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-ivory/15 bg-ivory/[0.04]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative flex flex-col justify-between p-7 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.number}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="script text-[2rem] leading-none text-gold">{step.number}</span>
                    <span className="h-px w-10 bg-gold/40" />
                    <span className="text-[8px] uppercase tracking-[0.24em] text-ivory/40">
                      Step {active + 1} of 7
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-[clamp(1.8rem,3vw,2.7rem)] leading-[1.02] text-ivory">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[12.5px] leading-[1.85] text-ivory/65">
                    {step.description}
                  </p>
                  <p className="mt-4 flex items-start gap-2 text-[10.5px] leading-relaxed text-gold/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {step.detail}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous step"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next step"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {!detailed && (
                  <Link
                    href="/process"
                    className="group inline-flex items-center gap-2 text-[8.5px] uppercase tracking-[0.2em] text-gold"
                  >
                    The full process
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden lg:min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.number}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src="/images/process-lab.jpg"
                    alt={`Step ${active + 1}: ${step.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                    style={{ objectPosition: `${20 + active * 8}% center` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/65 via-forest/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-ivory/20 bg-forest/60 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
                    <LineIcon name={step.icon} className="h-4 w-4 text-gold" />
                    {step.title}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-[10.5px] leading-relaxed text-ivory/40">
          Freeze-drying removes water through sublimation at low temperature. Conventional
          dehydration uses sustained heat, which changes texture, colour and the character of
          the ingredient.{" "}
          <Link href="/process" className="text-gold/80 underline underline-offset-4">
            Read the comparison
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ProcessTimelineCompact() {
  return <ProcessTimeline />;
}
