import Link from "next/link";
import { LeafMark } from "@/components/ui/Botanical";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const light = variant === "light";
  return (
    <Link
      href="/"
      aria-label="Tasty Treasures — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-500",
          light
            ? "border-gold/60 text-ivory group-hover:border-gold"
            : "border-gold/50 text-forest group-hover:border-gold",
        )}
      >
        <LeafMark className="h-6 w-6" />
        <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-serif text-[1.18rem] leading-none tracking-[0.01em]",
            light ? "text-ivory" : "text-forest",
          )}
        >
          Tasty Treasures
        </span>
        <span
          className={cn(
            "mt-1.5 text-[6.5px] font-medium uppercase tracking-[0.34em]",
            light ? "text-ivory/60" : "text-forest/55",
          )}
        >
          Naturally preserved
        </span>
      </span>
    </Link>
  );
}
