import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LeafMark } from "@/components/ui/Botanical";

export const metadata: Metadata = {
  title: "Studio sign in",
  description: "Private administration entrance for Tasty Treasures.",
  robots: { index: false, follow: false },
};

function safeNext(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) return "/admin";
  if (!candidate.startsWith("/admin")) return "/admin";
  return candidate;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const nextPath = safeNext(params.next);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-cream lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-forest p-10 text-ivory lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full border border-gold/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 h-[22rem] w-[22rem] rounded-full border border-gold/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #B49A58 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/50">
            <LeafMark className="h-5 w-5 text-gold" />
            <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <span>
            <span className="block font-serif text-[1.15rem] leading-none">Tasty Treasures</span>
            <span className="mt-1.5 block text-[7px] font-semibold uppercase tracking-[0.34em] text-gold/80">
              The studio
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="font-script text-[2.2rem] leading-none text-gold/90">Behind the pantry</p>
          <h2 className="mt-4 font-serif text-[clamp(2.4rem,3.4vw,3.4rem)] leading-[1.02]">
            The quiet work of
            <br />
            <span className="italic text-sage">making good food.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[12px] leading-[1.9] text-ivory/55">
            Every pouch, every order request and every note lives here. Keep the shelves tidy,
            answer people warmly, and let the ingredients speak for themselves.
          </p>
        </div>

        <div className="relative flex items-center justify-between border-t border-ivory/10 pt-6 text-[8px] uppercase tracking-[0.22em] text-ivory/35">
          <span>Small batch · Made in India</span>
          <span>Private access</span>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-charcoal/40 transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Storefront
          </Link>
          <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-charcoal/30 lg:hidden">
            <LeafMark className="h-4 w-4 text-gold" />
            Tasty Treasures
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-14">
          <LoginForm nextPath={nextPath} />
        </div>

        <p className="text-center text-[8px] uppercase tracking-[0.18em] text-charcoal/30">
          Tasty Treasures · Studio tools
        </p>
      </section>
    </main>
  );
}
