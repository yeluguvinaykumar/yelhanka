import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { getContent } from "@/lib/store";
import { Reveal } from "@/components/ui/Reveal";
import { BotanicalCorner, LeafMark } from "@/components/ui/Botanical";
import { ContactForm } from "@/components/contact/ContactForm";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact the Studio",
  description:
    "Questions about a product, an order or a wholesale enquiry? Write to the Tasty Treasures studio or message us on WhatsApp.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const [content, params] = await Promise.all([getContent(), searchParams]);
  const { site } = content;

  return (
    <>
      <section className="paper relative overflow-hidden pb-10 pt-8 sm:pt-12 lg:pb-14">
        <div className="pointer-events-none absolute inset-0">
          <BotanicalCorner className="absolute -left-12 bottom-0 h-64 w-64 text-forest/20" />
          <BotanicalCorner className="absolute -right-8 top-8 h-48 w-48 rotate-90 text-gold/25" />
          <div className="absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-sage/35 blur-3xl" />
        </div>
        <div className="editorial-container relative">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <span className="text-forest">Contact</span>
          </nav>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal>
                <span className="eyebrow">We&apos;re listening</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 font-serif text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[0.9] tracking-[-0.035em] text-forest">
                  Come say
                  <br />
                  <span className="italic text-burgundy">hello.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-lg text-[13px] leading-[1.85] text-charcoal/60">
                  A question about an ingredient, a parcel that needs tracking, or an idea for a
                  gift box — write to us. A real person reads every message.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="flex items-start gap-4 rounded-xl border border-gold/30 bg-ivory p-5 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream">
                  <Sparkles className="h-5 w-5 text-gold" strokeWidth={1.4} />
                </span>
                <div>
                  <p className="script text-[1.5rem] leading-none text-burgundy">
                    Usually one working day
                  </p>
                  <p className="mt-1.5 text-[10.5px] leading-[1.7] text-charcoal/55">
                    We reply Monday to Saturday. For urgent order help, WhatsApp is the fastest
                    way to reach the studio.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <Reveal>
            <ContactForm initialSubject={params.subject} />
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={0.06}>
              <div className="rounded-xl border border-gold/30 bg-forest p-6 text-ivory">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] uppercase tracking-[0.24em] text-gold">The quickest way</p>
                  <MessageCircle className="h-5 w-5 text-gold/80" strokeWidth={1.4} />
                </div>
                <p className="script mt-3 text-[1.9rem] leading-none text-gold">Message us.</p>
                <p className="mt-2 text-[12px] leading-[1.8] text-ivory/60">
                  Product advice, order updates and bulk enquiries. Send a message and we will
                  pick it up during studio hours.
                </p>
                <a
                  href={waLink(site.whatsapp, "Hi Tasty Treasures! I'd like some help.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-sm mt-5 w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <p className="mt-3 text-center text-[8.5px] uppercase tracking-[0.14em] text-ivory/35">
                  Opens WhatsApp · normal data rates apply
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-xl border border-forest/10 bg-cream/50 p-6">
                <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Studio details</p>
                <ul className="mt-4 space-y-4 text-[11.5px] leading-relaxed text-charcoal/60">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                    <span>{site.address}</span>
                  </li>
                  <li>
                    <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-burgundy">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                      <span>{site.email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="flex gap-3 hover:text-burgundy"
                    >
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                      <span>{site.phone}</span>
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                    <span>{site.hours}</span>
                  </li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-forest/10 pt-4 text-[9px] uppercase tracking-[0.14em] text-charcoal/40">
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-forest">
                    Instagram
                  </a>
                  <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-forest">
                    Facebook
                  </a>
                  <Link href="/faq" className="hover:text-forest">Read the FAQ</Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="rounded-xl border border-forest/10 bg-ivory p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-cream">
                    <LeafMark className="h-5 w-5 text-forest" />
                  </span>
                  <div>
                    <p className="font-serif text-[1.05rem] text-forest">Wholesale &amp; gifting</p>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-charcoal/40">
                      Cafés, hotels, hampers
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[10.5px] leading-[1.7] text-charcoal/50">
                  Tell us your quantity, timeline and packaging needs. We will share a trade sheet
                  and samples where appropriate.
                </p>
                <Link
                  href="/contact?subject=Wholesale%20%26%20gifting"
                  className="mt-3 inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-burgundy"
                >
                  Start a trade enquiry
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-forest/10 bg-cream py-10">
        <div className="editorial-container flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.16em] text-charcoal/45">
            Looking for delivery or return details?
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.14em] text-forest/60">
            <Link href="/policies/shipping" className="hover:text-burgundy">Shipping</Link>
            <Link href="/policies/returns" className="hover:text-burgundy">Returns</Link>
            <Link href="/policies/privacy" className="hover:text-burgundy">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-burgundy">Terms</Link>
          </div>
        </div>
      </section>
    </>
  );
}
