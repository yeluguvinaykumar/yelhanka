"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  MessageCircle,
  ShoppingBag,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { categories } from "@/lib/catalogue";
import { useCart } from "@/components/providers/CartProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { cn, waLink } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasMenu: true },
  { label: "Our Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart, hydrated } = useCart();
  const site = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-cream/88 backdrop-blur-xl transition-all duration-500",
          scrolled ? "border-forest/12 shadow-[0_10px_30px_-24px_rgba(16,63,37,0.5)]" : "border-transparent",
        )}
      >
        <div className="editorial-container flex h-[74px] items-center justify-between gap-6 lg:h-[82px]">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) =>
              item.hasMenu ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-1.5 py-3 text-[10.5px] font-medium uppercase tracking-[0.19em] transition-colors",
                      isActive(item.href) ? "text-forest" : "text-charcoal/65 hover:text-forest",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                    <span
                      className={cn(
                        "absolute bottom-1 left-0 h-px bg-gold transition-all duration-500",
                        isActive(item.href) ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-[300px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 ease-premium group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-gold/25 bg-ivory p-2 shadow-lift">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={category.href}
                          className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-cream"
                        >
                          <span>
                            <span className="block font-serif text-[15px] text-forest">
                              {category.name}
                            </span>
                            <span className="mt-0.5 block text-[10px] tracking-wide text-charcoal/55">
                              {category.tagline}
                            </span>
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
                        </Link>
                      ))}
                      <Link
                        href="/shop"
                        className="mt-1 flex items-center justify-between border-t border-forest/10 px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-burgundy"
                      >
                        View all products
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-3 text-[10.5px] font-medium uppercase tracking-[0.19em] transition-colors",
                    isActive(item.href) ? "text-forest" : "text-charcoal/65 hover:text-forest",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-1 left-0 h-px bg-gold transition-all duration-500",
                      isActive(item.href) ? "w-full" : "w-0 hover:w-full",
                    )}
                  />
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={waLink(
                site.whatsapp,
                "Hi Tasty Treasures! I'd like to know more about your products.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Tasty Treasures on WhatsApp"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:border-gold hover:text-burgundy sm:flex"
            >
              <MessageCircle className="h-[17px] w-[17px]" strokeWidth={1.6} />
            </a>
            <span className="mx-1 hidden h-5 w-px bg-forest/15 sm:block" />
            <button
              type="button"
              onClick={openCart}
              className="group relative flex h-10 items-center gap-2.5 rounded-full border border-forest/15 pl-3.5 pr-4 text-forest transition-colors hover:border-gold"
              aria-label={`Open cart, ${hydrated ? count : 0} items`}
            >
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.6} />
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] sm:inline">
                Cart
              </span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[9px] font-semibold",
                    count > 0 ? "bg-burgundy text-ivory" : "bg-forest/8 text-forest/60",
                  )}
                >
                  {hydrated ? count : 0}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="ml-0.5 grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[75] flex flex-col bg-cream lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex h-[74px] items-center justify-between px-5">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-10">
              <nav aria-label="Mobile navigation" className="mt-6 border-t border-forest/10 pt-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between border-b border-forest/10 py-4"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="font-serif text-[1.9rem] text-forest">{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-gold" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8">
                <p className="eyebrow">Shop by category</p>
                <div className="mt-4 grid gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={category.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-lg border border-forest/10 bg-ivory/60 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/75"
                    >
                      {category.name}
                      <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-xl bg-forest p-5 text-ivory">
                <p className="script text-2xl text-gold">We&apos;re here to help</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ivory/65">
                  Questions about a product or an order? Message us directly.
                </p>
                <a
                  href={waLink(site.whatsapp, "Hi Tasty Treasures! I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-sm mt-4 w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
