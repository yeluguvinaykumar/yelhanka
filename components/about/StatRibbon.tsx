"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Stat } from "@/lib/types";
import { LeafMark } from "@/components/ui/Botanical";

function Counter({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setValue(stat.value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(stat.value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, stat.value, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative px-4 py-6 text-center sm:px-6"
    >
      <p className="font-serif text-[clamp(2.4rem,4.5vw,3.6rem)] leading-none text-gold">
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
        {stat.label}
      </p>
      <p className="mx-auto mt-2 max-w-[190px] text-[9.5px] leading-[1.7] text-ivory/40">
        {stat.detail}
      </p>
    </motion.div>
  );
}

export function StatRibbon({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative overflow-hidden bg-forest section-pad-sm text-ivory">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 [background-image:radial-gradient(#B49A58_1px,transparent_1px)] [background-size:34px_34px]" />
        <LeafMark className="absolute -left-16 top-0 h-80 w-80 rotate-12" />
        <LeafMark className="absolute -right-16 bottom-0 h-80 w-80 -rotate-12" />
      </div>
      <div className="editorial-container relative">
        <div className="mb-7 text-center">
          <span className="eyebrow eyebrow-center text-gold">The promises, in numbers</span>
        </div>
        <div className="grid grid-cols-2 divide-ivory/10 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat, index) => (
            <Counter key={stat.label} stat={stat} index={index} />
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-center text-[9px] leading-relaxed text-ivory/30">
          These figures describe our ingredients and process. We publish only what we can
          stand behind, and update our content as the studio grows.
        </p>
      </div>
    </section>
  );
}
