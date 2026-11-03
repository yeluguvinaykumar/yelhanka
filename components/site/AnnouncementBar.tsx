"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const site = useSite();

  useEffect(() => {
    if (messages.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="relative z-[55] bg-forest text-ivory">
      <div className="editorial-container flex h-[34px] items-center justify-between gap-4 text-[9px] uppercase tracking-[0.2em]">
        <span className="hidden items-center gap-2 text-gold/90 sm:flex">
          <Leaf className="h-3 w-3" strokeWidth={1.5} />
          Nature&apos;s goodness, preserved
        </span>
        <div className="relative h-full flex-1 overflow-hidden sm:flex-none sm:min-w-[420px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center text-center text-ivory/85"
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className="hidden text-ivory/60 md:block">
          Free shipping over ₹{site.freeShippingThreshold}
        </span>
      </div>
    </div>
  );
}
