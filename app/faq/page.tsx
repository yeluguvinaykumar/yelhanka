import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { BotanicalCorner, LeafMark } from "@/components/ui/Botanical";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about freeze-drying, ingredients, storage, delivery, order requests, returns and wholesale enquiries at Tasty Treasures.",
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="paper relative overflow-hidden pb-10 pt-8 sm:pt-12 lg:pb-14">
        <div className="pointer-events-none absolute inset-0">
          <BotanicalCorner className="absolute -left-12 bottom-0 h-64 w-64 text-forest/20" />
          <div className="absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-sage/35 blur-3xl" />
        </div>
        <div className="editorial-container relative">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <span className="text-forest">FAQ</span>
          </nav>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal>
                <span className="eyebrow">Help &amp; information</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 font-serif text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[0.9] tracking-[-0.035em] text-forest">
                  Questions,
                  <br />
                  <span className="italic text-burgundy">answered.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-lg text-[13px] leading-[1.85] text-charcoal/60">
                  Everything we are asked most often — about the process, the pouches, delivery
                  and placing an order. If your question is not here, the studio is one message
                  away.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="flex items-start gap-4 rounded-xl border border-gold/30 bg-ivory p-5 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream">
                  <LeafMark className="h-6 w-6 text-forest" />
                </span>
                <div>
                  <p className="script text-[1.5rem] leading-none text-burgundy">A promise</p>
                  <p className="mt-1.5 text-[10.5px] leading-[1.7] text-charcoal/55">
                    We would rather answer honestly than sound impressive. If something is not
                    right, tell us and we will make it right.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container">
          <FaqAccordion />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
