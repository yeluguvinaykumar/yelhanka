import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { LeafMark } from "@/components/ui/Botanical";
import { waLink } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";

const shopLinks = [
  { label: "All products", href: "/shop" },
  { label: "Freeze-dried fruit", href: "/shop?category=freeze-dried-fruits" },
  { label: "Vegetable chips", href: "/shop?category=dehydrated-chips" },
  { label: "Superfood powders", href: "/shop?category=superfood-powders" },
  { label: "Gift combos", href: "/shop?category=gift-combos" },
];

const companyLinks = [
  { label: "Our story", href: "/about" },
  { label: "Our process", href: "/process" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Wholesale", href: "/contact?subject=Wholesale" },
];

const helpLinks = [
  { label: "Shipping policy", href: "/policies/shipping" },
  { label: "Return policy", href: "/policies/returns" },
  { label: "Privacy policy", href: "/policies/privacy" },
  { label: "Terms & conditions", href: "/policies/terms" },
  { label: "Track an order", href: "/contact?subject=Order" },
];

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M15 3h-2.2A3.8 3.8 0 0 0 9 6.8V10H6.5v3.4H9V21h3.5v-7.6h2.6l.6-3.4h-3.2V7.1c0-.6.3-.9.9-.9H15V3Z" />
    </svg>
  );
}

export function Footer({ content }: { content: SiteContent }) {
  const { site } = content;
  return (
    <footer className="relative overflow-hidden bg-forest text-ivory">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <LeafMark className="absolute -right-20 top-10 h-[420px] w-[420px] text-ivory" />
        <LeafMark className="absolute -bottom-32 -left-24 h-[380px] w-[380px] rotate-180 text-ivory" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      <div className="editorial-container relative py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="script mt-6 text-[1.7rem] text-gold">Goodness, kept beautifully.</p>
            <p className="mt-3 max-w-sm text-[13px] leading-[1.8] text-ivory/60">
              Freeze-dried fruit, vegetable chips and single-ingredient powders. Real food,
              made slowly, packed by hand.
            </p>
            <div className="mt-8 max-w-sm">
              <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">
                Notes from the pantry
              </p>
              <div className="mt-4">
                <NewsletterForm variant="dark" compact />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5 lg:pl-4">
            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">Shop</h3>
              <ul className="mt-5 space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[12px] text-ivory/60 transition-colors hover:text-ivory"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">Company</h3>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-ivory/60 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">Help</h3>
              <ul className="mt-5 space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-ivory/60 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">Visit & contact</h3>
              <ul className="mt-5 space-y-4 text-[12px] text-ivory/60">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" />
                  <span className="leading-relaxed">{site.address}</span>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-ivory">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-gold/80" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-ivory">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-gold/80" />
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 text-gold/80" />
                  <a
                    href={waLink(site.whatsapp, "Hi Tasty Treasures! I'd like to know more.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ivory"
                  >
                    WhatsApp us
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-[10px] leading-relaxed text-ivory/35">{site.hours}</p>
              <div className="mt-6 flex gap-2.5">
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tasty Treasures on Instagram"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <InstagramGlyph className="h-3.5 w-3.5" />
                </a>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tasty Treasures on Facebook"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <FacebookGlyph className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gold/25 bg-ivory/[0.04] p-6">
              <p className="script text-[1.7rem] leading-tight text-gold">A little treasure,<br />every month.</p>
              <p className="mt-3 text-[11.5px] leading-[1.8] text-ivory/55">
                Seasonal drops, process notes and recipes from the studio. Join our list for
                first access to small batches.
              </p>
              <Link href="/shop" className="btn btn-gold btn-sm mt-5 w-full">
                <span>Explore the pantry</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-ivory/35">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold" />
              Online payment is not enabled. Orders are confirmed personally on WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-14 h-px bg-ivory/10" />
        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-[9.5px] uppercase tracking-[0.16em] text-ivory/35 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Tasty Treasures. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/policies/privacy" className="hover:text-ivory/70">Privacy</Link>
            <Link href="/policies/shipping" className="hover:text-ivory/70">Shipping</Link>
            <Link href="/policies/returns" className="hover:text-ivory/70">Returns</Link>
            <Link href="/policies/terms" className="hover:text-ivory/70">Terms</Link>
            <Link href="/admin/login" className="text-ivory/20 hover:text-ivory/60">Studio</Link>
          </div>
        </div>
        <p className="mt-4 text-[8.5px] uppercase tracking-[0.2em] text-ivory/20">
          Made slowly in India · Freeze-dried, never fried
        </p>
      </div>
    </footer>
  );
}
