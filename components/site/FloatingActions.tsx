"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { waLink } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.23-8.23a8.22 8.22 0 0 1 8.22 8.24c0 4.54-3.69 8.23-8.23 8.23Z" />
    </svg>
  );
}

export function FloatingActions() {
  const site = useSite();
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(Math.max(ratio, 0), 1));
      setShowTop(window.scrollY > 640);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 20;

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group relative grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ivory/90 text-forest shadow-soft backdrop-blur"
          >
            <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1" />
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#B49A58"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
              />
            </svg>
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.6} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={waLink(
          site.whatsapp,
          "Hi Tasty Treasures! I'd like to know more about your natural food range.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-0 overflow-hidden rounded-full border border-gold/40 bg-botanical pl-3 pr-3 text-ivory shadow-lift transition-all duration-500 ease-premium hover:gap-2.5 hover:bg-forest hover:pl-4 hover:pr-5"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full text-ivory">
          <WhatsAppIcon className="h-6 w-6" />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 group-hover:max-w-[130px]">
          Chat with us
        </span>
      </a>
    </div>
  );
}
