"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, MessageCircle, Snowflake, Sparkles, Leaf, ShieldCheck } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { FruitGlyph, BotanicalCorner, GoldSprig, LeafMark } from "@/components/ui/Botanical";
import { ProductArt } from "@/components/commerce/ProductArt";
import { Magnetic } from "@/components/ui/Magnetic";
import { waLink } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";

const indicators = [
  { label: "100% Natural", Icon: Leaf },
  { label: "No Preservatives", Icon: Snowflake },
  { label: "No Additives", Icon: Sparkles },
  { label: "Chemical Free", Icon: ShieldCheck },
];

const heroProducts = [
  {
    name: "Moringa Powder",
    theme: "moringa" as const,
    accent: "forest" as const,
    packs: [{ label: "Pouch", grams: 100, price: 249 }],
  },
  {
    name: "ABC Powder",
    theme: "powder" as const,
    accent: "burgundy" as const,
    packs: [{ label: "Pouch", grams: 100, price: 399 }],
  },
];

function StaggeredWord({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-hidden>
      {text.split("").map((letter, index) => (
        <span key={`${letter}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "115%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.95,
              delay: delay + index * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const site = useSite();
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.5 });

  const imageX = useTransform(sx, [-1, 1], [-9, 9]);
  const imageY = useTransform(sy, [-1, 1], [-7, 7]);
  const cardLeftX = useTransform(sx, [-1, 1], [16, -16]);
  const cardLeftY = useTransform(sy, [-1, 1], [12, -12]);
  const cardRightX = useTransform(sx, [-1, 1], [-20, 20]);
  const cardRightY = useTransform(sy, [-1, 1], [10, -14]);
  const tokenX = useTransform(sx, [-1, 1], [-26, 26]);
  const tokenY = useTransform(sy, [-1, 1], [-18, 18]);

  const firstVisit =
    typeof window !== "undefined"
      ? !window.sessionStorage.getItem("tt-intro-seen-v1")
      : true;
  const baseDelay = firstVisit ? 1.65 : 0.18;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    py.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <section
      className="paper relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24 lg:pt-16"
      onPointerMove={handleMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[540px] w-[540px] rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#103F25_1px,transparent_1px)] [background-size:24px_24px]" />
        <BotanicalCorner className="absolute -left-10 bottom-0 h-[240px] w-[240px] text-forest/25" />
        <BotanicalCorner className="absolute -right-8 top-10 h-[200px] w-[200px] rotate-90 text-gold/30" />
        <GoldSprig className="absolute right-[46%] top-16 hidden h-24 w-16 text-gold/40 lg:block" />
        {[
          { left: "6%", top: "28%", size: 5, delay: 0 },
          { left: "42%", top: "12%", size: 3, delay: 1.2 },
          { left: "54%", top: "72%", size: 4, delay: 0.6 },
          { left: "90%", top: "56%", size: 3, delay: 2 },
          { left: "78%", top: "18%", size: 5, delay: 1.6 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold/60"
            style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
            animate={reduce ? undefined : { y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 7 + i, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="editorial-container relative grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8 xl:gap-14">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-10 bg-gold" />
            <span className="script text-[1.75rem] leading-none text-burgundy sm:text-[2rem]">
              {hero.eyebrow}
            </span>
          </motion.div>

          <h1
            className="hero-display mt-5 text-forest sm:mt-6"
            aria-label={`${hero.titleTop} ${hero.titleBottom}`}
          >
            <span className="block">
              <StaggeredWord text={hero.titleTop} delay={baseDelay + 0.08} />
            </span>
            <span className="mt-1 block text-burgundy">
              <StaggeredWord text={hero.titleBottom} delay={baseDelay + 0.28} />
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.65 }}
            className="mt-6 max-w-[540px] text-[13.5px] leading-[1.85] text-charcoal/72 sm:text-[14.5px]"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.8 }}
            className="mt-7 grid max-w-[520px] grid-cols-2 gap-x-6 gap-y-4 border-y border-forest/10 py-5 sm:grid-cols-4 sm:gap-x-3"
          >
            {indicators.map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <span className="text-[8.5px] font-medium uppercase leading-[1.35] tracking-[0.09em] text-forest/75">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.95 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={7}>
              <Link href="/shop" className="btn btn-primary">
                <span>Explore Products</span>
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={7}>
              <a
                href={waLink(
                  site.whatsapp,
                  "Hi Tasty Treasures! I'd like to order some products.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary group"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="arrow-slide h-3.5 w-3.5" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: baseDelay + 1.1 }}
            className="mt-7 flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-charcoal/40"
          >
            <span className="flex -space-x-1.5">
              {["#651C2B", "#B49A58", "#175C32"].map((color) => (
                <span
                  key={color}
                  className="h-2 w-2 rounded-full border border-cream"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            Freeze-dried · Never fried · Packed by hand
          </motion.div>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[520px] lg:h-[590px]">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{ duration: 1.35, delay: baseDelay + 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-3 overflow-hidden rounded-t-[220px] rounded-b-[28px] border border-gold/35 bg-sage/40 shadow-lift sm:top-0 sm:rounded-t-[260px]"
            style={{ height: "88%" }}
          >
            <motion.div className="absolute inset-0" style={{ x: imageX, y: imageY }}>
              <Image
                src={hero.image}
                alt="A generous arrangement of fresh and freeze-dried fruit on linen"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="scale-[1.08] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-forest/30 via-transparent to-cream/10" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest/45 to-transparent" />
            </motion.div>
            <div className="absolute inset-4 rounded-t-[200px] rounded-b-[18px] border border-ivory/20" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-ivory">
              <div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-ivory/70">The pantry, in season</p>
                <p className="mt-1 font-serif text-[19px] leading-tight">Fruit at its peak</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ivory/40">
                <LeafMark className="h-5 w-5 text-ivory" />
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -left-2 bottom-8 z-20 w-[132px] sm:-left-8 sm:bottom-10 sm:w-[158px]"
            style={{ x: cardLeftX, y: cardLeftY }}
            initial={reduce ? false : { opacity: 0, y: 40, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 1, delay: baseDelay + 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative overflow-hidden rounded-xl border border-gold/30 bg-ivory p-1.5 shadow-lift">
              <div className="relative aspect-[3/4.1] overflow-hidden rounded-lg">
                <ProductArt product={heroProducts[0]} compact />
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-1/2 animate-sweep bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                </span>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-2">
                <span className="text-[7px] uppercase tracking-[0.18em] text-forest/60">Bestseller</span>
                <span className="text-[9px] font-medium text-forest">₹249</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-1 bottom-16 z-20 w-[142px] sm:-right-6 sm:bottom-20 sm:w-[172px]"
            style={{ x: cardRightX, y: cardRightY }}
            initial={reduce ? false : { opacity: 0, y: 44, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ duration: 1, delay: baseDelay + 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative overflow-hidden rounded-xl border border-gold/30 bg-ivory p-1.5 shadow-lift">
              <div className="relative aspect-[3/4.1] overflow-hidden rounded-lg">
                <ProductArt product={heroProducts[1]} compact />
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-1/2 animate-sweep bg-gradient-to-r from-transparent via-white/45 to-transparent [animation-delay:2s]" />
                </span>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-2">
                <span className="text-[7px] uppercase tracking-[0.18em] text-forest/60">Daily ritual</span>
                <span className="text-[9px] font-medium text-forest">₹399</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-[6%] top-[18%] z-20 h-12 w-12 rounded-full border border-gold/40 bg-ivory/95 p-2 shadow-soft backdrop-blur sm:h-14 sm:w-14"
            style={{ x: tokenX, y: tokenY }}
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <FruitGlyph theme="mango" />
          </motion.div>
          <div className="absolute right-[2%] top-[44%] z-20 hidden h-11 w-11 animate-float rounded-full border border-gold/40 bg-ivory/95 p-2 shadow-soft sm:block [animation-delay:2s]">
            <FruitGlyph theme="berry" />
          </div>
          <div className="absolute left-[2%] top-[46%] z-20 hidden h-10 w-10 animate-float rounded-full border border-gold/40 bg-ivory/95 p-2 shadow-soft [animation-delay:4s] lg:block">
            <FruitGlyph theme="kiwi" />
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: baseDelay + 1.15 }}
            className="absolute -right-1 top-0 z-30 hidden h-[92px] w-[92px] sm:grid sm:place-items-center lg:-right-4"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
              <defs>
                <path id="sealPath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="#FFFDF5" fillOpacity="0.92" stroke="#B49A58" strokeWidth="0.6" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#B49A58" strokeWidth="0.4" strokeOpacity="0.6" />
              <text fill="#103F25" fontSize="6.1" letterSpacing="2.4">
                <textPath href="#sealPath" startOffset="2%">
                  100% NATURAL · FREEZE-DRIED · SMALL BATCH ·
                </textPath>
              </text>
            </svg>
            <LeafMark className="h-7 w-7 text-forest" />
          </motion.div>
        </div>
      </div>

      <div className="editorial-container relative mt-12 hidden items-center justify-between border-t border-forest/10 pt-5 text-[9px] uppercase tracking-[0.22em] text-charcoal/40 sm:flex">
        <span>Bringing nature&apos;s goodness to you</span>
        <span className="flex items-center gap-2">
          Scroll to discover
          <span className="relative block h-8 w-px overflow-hidden bg-forest/15">
            <motion.span
              className="absolute left-0 top-0 h-3 w-px bg-gold"
              animate={{ y: [-12, 32] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </span>
      </div>
    </section>
  );
}
