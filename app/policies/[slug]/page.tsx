import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { getContent } from "@/lib/store";
import {
  getPolicy,
  hydratePolicyText,
  policies,
  type PolicyBlock,
} from "@/lib/policies";
import { Reveal } from "@/components/ui/Reveal";
import { BotanicalCorner, LeafMark } from "@/components/ui/Botanical";
import { slugify, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Policy not found" };
  return {
    title: policy.title,
    description: policy.description,
    alternates: { canonical: `/policies/${policy.slug}` },
  };
}

function Block({ block, text }: { block: PolicyBlock; text: (value: string) => string }) {
  if (block.type === "ul") {
    return (
      <ul className="my-4 space-y-2.5">
        {block.items.map((item) => (
          <li key={item} className="relative pl-5 text-[12px] leading-[1.85] text-charcoal/65">
            <span className="absolute left-0 top-[0.72rem] h-1 w-1 rounded-full bg-gold" />
            {text(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "note") {
    return (
      <div className="my-5 rounded-xl border border-gold/30 bg-cream/60 p-4">
        <p className="flex items-start gap-2.5 text-[11px] leading-[1.8] text-charcoal/60">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {text(block.text)}
        </p>
      </div>
    );
  }

  return (
    <p className="my-3.5 text-[12px] leading-[1.9] text-charcoal/65 sm:text-[12.5px]">
      {text(block.text)}
    </p>
  );
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, content] = await Promise.all([params, getContent()]);
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const site = content.site;
  const text = (value: string) => hydratePolicyText(value, site);
  const currentIndex = policies.findIndex((item) => item.slug === policy.slug);
  const nextPolicy = policies[(currentIndex + 1) % policies.length];

  return (
    <>
      <section className="paper relative overflow-hidden border-b border-forest/10">
        <div className="pointer-events-none absolute inset-0">
          <BotanicalCorner className="absolute -left-12 bottom-0 h-56 w-56 text-forest/15" />
          <BotanicalCorner className="absolute -right-10 top-6 h-48 w-48 rotate-90 text-gold/20" />
        </div>
        <div className="editorial-container relative py-8 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <span className="text-forest">Policies</span>
            <span>/</span>
            <span className="text-forest">{policy.title}</span>
          </nav>

          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <span className="eyebrow">{policy.eyebrow}</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-4 font-serif text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[0.94] tracking-[-0.035em] text-forest">
                  {policy.title}
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-4 max-w-lg text-[12px] leading-[1.85] text-charcoal/55">
                  {policy.description}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="flex items-center gap-3 rounded-xl border border-gold/25 bg-ivory/70 px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-[8px] uppercase tracking-[0.18em] text-charcoal/40">
                    Last updated
                  </p>
                  <p className="mt-0.5 text-[11px] text-forest">{policy.updated}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container grid items-start gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-[112px]">
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">The fine print</p>
            <nav aria-label="Policy pages" className="mt-3 space-y-1">
              {policies.map((item) => {
                const active = item.slug === policy.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/policies/${item.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[11px] transition-colors ${
                      active
                        ? "bg-forest text-ivory"
                        : "text-charcoal/55 hover:bg-cream hover:text-forest"
                    }`}
                  >
                    {item.title}
                    <ArrowRight className={`h-3 w-3 ${active ? "text-gold" : "opacity-30"}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 rounded-xl border border-forest/10 bg-cream/50 p-4">
              <div className="flex items-center gap-2">
                <LeafMark className="h-5 w-5 text-forest/60" />
                <p className="font-serif text-[0.95rem] text-forest">Need a person?</p>
              </div>
              <p className="mt-2 text-[10px] leading-[1.75] text-charcoal/50">
                If anything here is unclear, write to the studio. We would rather answer a
                question than leave you guessing.
              </p>
              <a
                href={waLink(site.whatsapp, `Hi ${site.name}! I have a question about your ${policy.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-burgundy hover:text-forest"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message the studio
              </a>
            </div>

            <div className="mt-4 hidden space-y-2.5 text-[9px] leading-relaxed text-charcoal/40 lg:block">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                {site.email}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                {site.address}
              </p>
            </div>
          </aside>

          <div>
            <div className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft sm:p-9">
              <div className="flex items-start gap-4 border-b border-forest/10 pb-5">
                <span className="script hidden text-[2rem] leading-none text-burgundy/70 sm:block">
                  {policy.slug === "privacy"
                    ? "carefully."
                    : policy.slug === "shipping"
                      ? "on its way."
                      : policy.slug === "returns"
                        ? "make it right."
                        : "in good faith."}
                </span>
                <p className="text-[12px] leading-[1.9] text-charcoal/65">{text(policy.intro)}</p>
              </div>

              <nav
                aria-label="Sections in this policy"
                className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1"
              >
                {policy.sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#${slugify(section.title)}`}
                    className="shrink-0 rounded-full border border-forest/12 px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] text-charcoal/50 transition-colors hover:border-gold hover:text-forest"
                  >
                    {String(index + 1).padStart(2, "0")} · {section.title}
                  </a>
                ))}
              </nav>

              <div className="mt-2">
                {policy.sections.map((section, index) => (
                  <section
                    key={section.title}
                    id={slugify(section.title)}
                    className="scroll-mt-28 border-t border-forest/10 pt-6 first:border-t-0 first:pt-0"
                  >
                    <div className="mt-6 flex items-baseline gap-3 first:mt-0">
                      <span className="text-[8px] font-medium tracking-[0.16em] text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-serif text-[clamp(1.25rem,2.2vw,1.65rem)] leading-tight text-forest">
                        {section.title}
                      </h2>
                    </div>
                    <div className="mt-3 pl-0 sm:pl-7">
                      {section.blocks.map((block, blockIndex) => (
                        <Block key={`${section.title}-${blockIndex}`} block={block} text={text} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-8 border-t border-forest/10 pt-6">
                <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal/35">
                  Last updated · {policy.updated}
                </p>
                <p className="mt-3 text-[11px] leading-[1.8] text-charcoal/50">
                  Questions? Email{" "}
                  <a href={`mailto:${site.email}`} className="text-burgundy underline underline-offset-2">
                    {site.email}
                  </a>{" "}
                  or message{" "}
                  <a
                    href={waLink(site.whatsapp, `Hi ${site.name}! I have a question about your ${policy.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy underline underline-offset-2"
                  >
                    {site.phone}
                  </a>
                  . Studio hours: {site.hours}.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-forest/10 bg-cream/50 px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] text-gold">Next</p>
                <p className="mt-0.5 font-serif text-[1rem] text-forest">{nextPolicy.title}</p>
              </div>
              <Link
                href={`/policies/${nextPolicy.slug}`}
                className="inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-forest hover:text-burgundy"
              >
                Read next
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
