"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LeafMark } from "@/components/ui/Botanical";

const SESSION_KEY = "tt-intro-seen-v1";

export function Preloader() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) return;
    setShow(true);

    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 16 + 6);
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setShow(false);
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // Storage may be unavailable in private mode.
          }
        }, 520);
      }
    }, 130);

    return () => window.clearInterval(timer);
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[120] overflow-hidden bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Loading Tasty Treasures"
          role="status"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#FFFDF5_0%,#F4F0E5_60%,#EDE5D2_100%)]" />
          <div className="absolute inset-0 opacity-[0.35]">
            {[...Array(14)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-gold/50"
                style={{
                  left: `${8 + ((i * 37) % 84)}%`,
                  top: `${12 + ((i * 53) % 72)}%`,
                  width: i % 3 === 0 ? 4 : 2,
                  height: i % 3 === 0 ? 4 : 2,
                }}
                animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{
                  duration: 4 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-28 w-28 items-center justify-center"
            >
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                <motion.circle
                  cx="60"
                  cy="60"
                  r="58"
                  fill="none"
                  stroke="#B49A58"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </svg>
              <span className="absolute inset-4 rounded-full border border-gold/25" />
              <LeafMark className="h-12 w-12 text-forest" />
              <motion.span
                className="absolute inset-y-0 -left-1 w-8 bg-gradient-to-r from-transparent via-ivory/80 to-transparent"
                animate={{ x: [0, 140, 140] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 font-serif text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em] text-forest"
            >
              Tasty <span className="italic text-burgundy">Treasures</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="script mt-4 text-[1.6rem] text-burgundy/80"
            >
              Bringing Nature&apos;s Goodness to You
            </motion.p>

            <div className="mt-10 w-[min(240px,62vw)]">
              <div className="h-px w-full bg-forest/12">
                <motion.div
                  className="h-px bg-gold"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-forest/50">
                <span>Preparing the good stuff</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <span className="absolute bottom-8 left-0 right-0 text-center text-[8px] uppercase tracking-[0.34em] text-forest/40">
            Freeze-dried · Small batch · India
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
