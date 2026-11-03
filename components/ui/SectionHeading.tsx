import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal y={14} duration={0.6}>
          <span
            className={cn(
              "eyebrow",
              align === "center" && "eyebrow-center",
              light && "text-gold",
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "mt-5 font-serif text-[clamp(2.3rem,4.6vw,4.15rem)] leading-[0.98] tracking-[-0.03em]",
            light ? "text-ivory" : "text-forest",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-6 max-w-xl text-[0.95rem] leading-[1.8]",
              align === "center" && "mx-auto",
              light ? "text-ivory/70" : "text-charcoal/70",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
