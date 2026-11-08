import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutClient, type PaymentOptions } from "@/components/checkout/CheckoutClient";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Share your delivery details and place your order — pay securely online with Razorpay, or confirm on WhatsApp or cash on delivery.",
  robots: { index: false, follow: false },
};

const steps = ["Basket", "Details", "Confirmation"];

export default async function CheckoutPage() {
  const settings = await getSettings();
  const payments: PaymentOptions = {
    // Online checkout only appears when both the studio switch is on and the
    // gateway keys actually resolve (settings or environment).
    razorpayEnabled: settings.payments.razorpayEnabled && (await isRazorpayConfigured()),
    codEnabled: settings.payments.codEnabled,
    whatsappEnabled: settings.payments.whatsappEnabled,
  };
  return (
    <>
      <section className="paper border-b border-forest/10">
        <div className="editorial-container py-8 sm:py-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/40"
          >
            <Link href="/" className="hover:text-forest">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-forest">Basket</Link>
            <span>/</span>
            <span className="text-forest">Checkout</span>
          </nav>
          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Almost there</span>
              <h1 className="mt-4 font-serif text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[0.92] tracking-[-0.035em] text-forest">
                A few <span className="italic text-burgundy">details.</span>
              </h1>
            </div>
            <ol className="flex items-center gap-2 text-[8px] uppercase tracking-[0.16em] text-charcoal/35">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={
                      index === 1
                        ? "text-forest"
                        : index === 0
                          ? "text-charcoal/55"
                          : "text-charcoal/30"
                    }
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && <span className="text-gold/60">—</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad-sm">
        <div className="editorial-container">
          <CheckoutClient payments={payments} />
        </div>
      </section>
    </>
  );
}
