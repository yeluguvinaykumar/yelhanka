import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FruitGlyph } from "@/components/ui/Botanical";
import { homeCategories } from "@/lib/catalogue";

export function CategoryGrid() {
  return (
    <section className="paper relative overflow-hidden section-pad">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="editorial-container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The collection"
            title={
              <>
                Our <span className="italic text-burgundy">products.</span>
              </>
            }
            description="Discover nature's finest treasures — fruit, vegetables and leaves, kept close to the way they were picked."
          />
          <Reveal delay={0.15}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 border-b border-forest/25 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-forest transition-colors hover:border-gold"
            >
              Shop the full pantry
              <ArrowRight className="arrow-slide h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeCategories.map((category, index) => (
            <Reveal key={category.name} delay={index * 0.08} y={26}>
              <Link
                href={category.href}
                data-cursor="EXPLORE"
                className="group relative block overflow-hidden rounded-xl border border-forest/10 bg-forest"
              >
                <div className="relative aspect-[3/4.25] w-full overflow-hidden">
                  <Image
                    src={
                      category.theme === "moringa"
                        ? "/images/category-moringa.jpg"
                        : index === 0
                          ? "/images/category-fruits.jpg"
                          : index === 1
                            ? "/images/category-chips.jpg"
                            : "/images/category-powders.jpg"
                    }
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                    className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/92 via-forest/30 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/20 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-3 rounded-lg border border-ivory/0 transition-all duration-700 group-hover:border-gold/50" />

                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
                    <span className="rounded-full border border-ivory/25 bg-forest/25 px-3 py-1.5 text-[7.5px] uppercase tracking-[0.2em] text-ivory/85 backdrop-blur">
                      0{index + 1} / Collection
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-ivory/30 text-ivory opacity-70 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-forest group-hover:opacity-100">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-3 h-9 w-9 rounded-full border border-ivory/20 bg-ivory/10 p-1.5 backdrop-blur-sm">
                      <FruitGlyph theme={category.theme} />
                    </div>
                    <h3 className="font-serif text-[1.55rem] leading-[1.05] text-ivory">
                      {category.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[10.5px] leading-[1.6] text-ivory/65">
                      {category.tagline}
                    </p>
                    <span className="mt-4 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-gold">
                      Explore
                      <span className="h-px w-6 bg-gold/60 transition-all duration-500 group-hover:w-10" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
