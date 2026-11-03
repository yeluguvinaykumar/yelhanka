"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { ProductArt } from "@/components/commerce/ProductArt";
import { LeafMark } from "@/components/ui/Botanical";
import { cn, formatINR, waLink } from "@/lib/utils";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

type FormState = typeof initialForm;
type Payment = "whatsapp" | "cod";

function validate(form: FormState, accepted: boolean) {
  if (form.name.trim().length < 2) return "Please enter your full name.";
  if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    return "Please check your email address, or leave it blank.";
  }
  if (form.address.trim().length < 8) return "Please enter your full delivery address.";
  if (!form.city.trim()) return "Please enter your city or town.";
  if (!form.state) return "Please choose your state.";
  if (!/^\d{5,6}$/.test(form.pincode.trim())) return "Please enter a valid 5 or 6 digit pincode.";
  if (!accepted) return "Please accept the order and privacy terms to continue.";
  return "";
}

function buildWhatsAppMessage(order: Order, siteName: string) {
  return [
    `Hi ${siteName}! I've placed order request ${order.id} on your website.`,
    "",
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    order.customer.email ? `Email: ${order.customer.email}` : "",
    `Delivery: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : "",
    "",
    "Items:",
    ...order.items.map(
      (item) =>
        `• ${item.name} — ${item.packLabel} (${item.grams} g) × ${item.qty} — ${formatINR(
          item.price * item.qty,
        )}`,
    ),
    "",
    `Subtotal: ${formatINR(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "Free" : formatINR(order.shipping)}`,
    `Total: ${formatINR(order.total)}`,
    "",
    `Payment preference: ${order.payment === "cod" ? "Cash on delivery (subject to confirmation)" : "Confirm and pay via WhatsApp"}`,
    "",
    "Please confirm availability and the next steps. Thank you!",
  ]
    .filter(Boolean)
    .join("\n");
}

export function CheckoutClient() {
  const { items, count, subtotal, hydrated, clearCart } = useCart();
  const site = useSite();
  const [form, setForm] = useState<FormState>(initialForm);
  const [payment, setPayment] = useState<Payment>("whatsapp");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const shipping = subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : site.shippingFee;
  const total = subtotal + shipping;
  const threshold = Math.max(site.freeShippingThreshold, 1);
  const remaining = Math.max(site.freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  const whatsappHref = useMemo(
    () => (order ? waLink(site.whatsapp, buildWhatsAppMessage(order, site.name)) : "#"),
    [order, site.whatsapp, site.name],
  );

  const setField = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = validate(form, accepted);
    if (message) {
      setError(message);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || undefined,
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state,
            pincode: form.pincode.trim(),
            notes: form.notes.trim() || undefined,
          },
          items: items.map((item) => ({
            productId: item.productId,
            packLabel: item.packLabel,
            qty: item.qty,
          })),
          payment,
        }),
      });

      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error || "We couldn't place your order just now.");
      }

      setOrder(data.order);
      clearCart();
      setStatus("idle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again or message us on WhatsApp.",
      );
      setStatus("error");
    }
  };

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="h-[560px] animate-pulse rounded-2xl border border-forest/10 bg-cream/60" />
        <div className="h-[360px] animate-pulse rounded-2xl border border-forest/10 bg-cream/60" />
      </div>
    );
  }

  if (order) {
    return (
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-gold/30 bg-ivory shadow-soft"
        >
          <div className="relative overflow-hidden bg-forest px-6 py-10 text-center text-ivory sm:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
              <LeafMark className="absolute -left-10 -top-10 h-48 w-48 text-ivory" />
              <LeafMark className="absolute -bottom-16 -right-8 h-56 w-56 rotate-180 text-ivory" />
            </div>
            <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/60 bg-forest">
              <Check className="h-8 w-8 text-gold" strokeWidth={1.8} />
            </span>
            <p className="relative mt-5 text-[8px] uppercase tracking-[0.28em] text-gold">
              Order request received
            </p>
            <h2 className="relative mt-2 font-serif text-[clamp(2rem,4.4vw,3rem)] leading-tight">
              Thank you, {order.customer.name.split(" ")[0]}.
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-[12px] leading-[1.85] text-ivory/65">
              Your selection is with the studio. No payment has been taken. We will confirm
              availability, delivery and payment with you personally.
            </p>
            <p className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/[0.06] px-5 py-2.5 text-[9px] uppercase tracking-[0.18em] text-ivory/80">
              Reference · <strong className="font-semibold text-gold">{order.id}</strong>
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                Your request
              </h3>
              <ul className="mt-4 divide-y divide-forest/10 border-y border-forest/10">
                {order.items.map((item) => (
                  <li key={`${item.productId}-${item.packLabel}`} className="flex justify-between gap-4 py-3">
                    <div>
                      <p className="font-serif text-[1rem] text-forest">{item.name}</p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-charcoal/40">
                        {item.packLabel} · {item.grams} g × {item.qty}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-forest">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1.5 text-[11.5px]">
                <div className="flex justify-between text-charcoal/55">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal/55">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-forest/10 pt-2 text-[14px] font-medium text-forest">
                  <span>Total</span>
                  <span>{formatINR(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-forest/10 bg-cream/50 p-4">
                <p className="text-[8px] uppercase tracking-[0.2em] text-gold">Delivering to</p>
                <p className="mt-2 text-[12px] font-medium text-forest">{order.customer.name}</p>
                <p className="mt-1 text-[11px] leading-[1.7] text-charcoal/55">
                  {order.customer.address}
                  <br />
                  {order.customer.city}, {order.customer.state} {order.customer.pincode}
                  <br />
                  {order.customer.phone}
                  {order.customer.email ? ` · ${order.customer.email}` : ""}
                </p>
                {order.customer.notes && (
                  <p className="mt-2 border-t border-forest/10 pt-2 text-[10px] leading-relaxed text-charcoal/45">
                    Note: {order.customer.notes}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-gold/30 bg-ivory p-4">
                <p className="text-[8px] uppercase tracking-[0.2em] text-gold">Payment preference</p>
                <p className="mt-1.5 flex items-center gap-2 text-[12px] text-forest">
                  {order.payment === "cod" ? (
                    <Banknote className="h-4 w-4 text-gold" />
                  ) : (
                    <MessageCircle className="h-4 w-4 text-gold" />
                  )}
                  {order.payment === "cod" ? "Cash on delivery (to confirm)" : "Confirm on WhatsApp"}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-charcoal/45">
                  {order.payment === "cod"
                    ? "COD availability depends on your pincode. We will confirm before dispatch."
                    : "Send us the order reference on WhatsApp and we will share payment details."}
                </p>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send details on WhatsApp</span>
              </a>
              <p className="text-center text-[8.5px] leading-relaxed text-charcoal/35">
                Opens WhatsApp with your order reference already filled in.
              </p>
            </div>
          </div>

          <div className="border-t border-forest/10 bg-cream/40 px-6 py-5 sm:px-10">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { step: "01", title: "We review", text: "Stock and delivery are checked by hand." },
                { step: "02", title: "We confirm", text: "You hear from us on WhatsApp or phone." },
                { step: "03", title: "We pack", text: "Your parcel is sealed and dispatched." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <span className="font-serif text-[12px] text-gold">{item.step}</span>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-forest">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-charcoal/45">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-forest hover:text-burgundy"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue shopping
              </Link>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] uppercase tracking-[0.12em] text-charcoal/40">
                <Link href="/policies/shipping" className="hover:text-forest">Shipping</Link>
                <Link href="/policies/returns" className="hover:text-forest">Returns</Link>
                <Link href="/policies/privacy" className="hover:text-forest">Privacy</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-cream/40 px-6 py-16 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-ivory">
          <LeafMark className="h-9 w-9 text-forest/60" />
        </span>
        <h2 className="mt-5 font-serif text-[2rem] text-forest">Your basket is empty.</h2>
        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-[1.8] text-charcoal/55">
          Add a pouch or two before heading to checkout. The pantry is open.
        </p>
        <Link href="/shop" className="btn btn-primary mt-6">
          <span>Explore the pantry</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
      <div className="space-y-6">
        <section className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Step one</p>
              <h2 className="mt-1.5 font-serif text-[clamp(1.55rem,2.6vw,2rem)] leading-tight text-forest">
                Who should we send this to?
              </h2>
            </div>
            <span className="script hidden text-[1.6rem] leading-none text-burgundy/70 sm:block">
              hello!
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-name" className="field-label">Full name *</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/35" />
                <input
                  id="checkout-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  className="field pl-10"
                  placeholder="First and last name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-phone" className="field-label">Phone / WhatsApp *</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/35" />
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  className="field pl-10"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-email" className="field-label">Email (optional)</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/35" />
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                  className="field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft sm:p-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Step two</p>
            <h2 className="mt-1.5 font-serif text-[clamp(1.55rem,2.6vw,2rem)] leading-tight text-forest">
              Where should it arrive?
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-address" className="field-label">Delivery address *</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-forest/35" />
                <textarea
                  id="checkout-address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  className="field pl-10"
                  placeholder="House or flat number, building, street, area"
                />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-city" className="field-label">City / town *</label>
              <input
                id="checkout-city"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => setField("city", event.target.value)}
                className="field"
                placeholder="Kochi"
              />
            </div>
            <div>
              <label htmlFor="checkout-pincode" className="field-label">Pincode *</label>
              <input
                id="checkout-pincode"
                name="pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={form.pincode}
                onChange={(event) => setField("pincode", event.target.value.replace(/\D/g, ""))}
                className="field"
                placeholder="682016"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="checkout-state" className="field-label">State / union territory *</label>
              <select
                id="checkout-state"
                name="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={(event) => setField("state", event.target.value)}
                className="field appearance-none"
              >
                <option value="">Choose your state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="checkout-notes" className="field-label">Delivery notes (optional)</label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                className="field"
                placeholder="Landmark, gate code, preferred delivery window — anything helpful."
              />
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-[9px] leading-relaxed text-charcoal/40">
            <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            We currently deliver across India. International delivery is not available yet.
          </p>
        </section>

        <section className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft sm:p-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Step three</p>
            <h2 className="mt-1.5 font-serif text-[clamp(1.55rem,2.6vw,2rem)] leading-tight text-forest">
              How would you like to confirm?
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-charcoal/50">
              Online payment is not enabled. Choose how you would like the studio to reach you.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPayment("whatsapp")}
              aria-pressed={payment === "whatsapp"}
              className={cn(
                "flex h-full flex-col rounded-xl border p-4 text-left transition-all duration-300",
                payment === "whatsapp"
                  ? "border-forest bg-forest/[0.04] ring-1 ring-forest/10"
                  : "border-forest/15 hover:border-gold",
              )}
            >
              <span className="flex items-center justify-between">
                <MessageCircle className="h-5 w-5 text-gold" strokeWidth={1.5} />
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border",
                    payment === "whatsapp" ? "border-forest bg-forest text-ivory" : "border-forest/25",
                  )}
                >
                  {payment === "whatsapp" && <Check className="h-2.5 w-2.5" />}
                </span>
              </span>
              <span className="mt-3 text-[10.5px] font-medium text-forest">Confirm on WhatsApp</span>
              <span className="mt-1 text-[10px] leading-relaxed text-charcoal/45">
                We create your request, then you send it to the studio with one tap. Payment is
                arranged personally.
              </span>
              <span className="mt-3 text-[7.5px] uppercase tracking-[0.14em] text-gold">Recommended</span>
            </button>

            <button
              type="button"
              onClick={() => setPayment("cod")}
              aria-pressed={payment === "cod"}
              className={cn(
                "flex h-full flex-col rounded-xl border p-4 text-left transition-all duration-300",
                payment === "cod"
                  ? "border-forest bg-forest/[0.04] ring-1 ring-forest/10"
                  : "border-forest/15 hover:border-gold",
              )}
            >
              <span className="flex items-center justify-between">
                <Banknote className="h-5 w-5 text-gold" strokeWidth={1.5} />
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border",
                    payment === "cod" ? "border-forest bg-forest text-ivory" : "border-forest/25",
                  )}
                >
                  {payment === "cod" && <Check className="h-2.5 w-2.5" />}
                </span>
              </span>
              <span className="mt-3 text-[10.5px] font-medium text-forest">Cash on delivery</span>
              <span className="mt-1 text-[10px] leading-relaxed text-charcoal/45">
                Request COD. Availability depends on your pincode and is confirmed before dispatch.
              </span>
              <span className="mt-3 text-[7.5px] uppercase tracking-[0.14em] text-charcoal/35">
                Subject to confirmation
              </span>
            </button>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-forest/10 pt-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
            />
            <span className="text-[10px] leading-relaxed text-charcoal/50">
              I understand this is an order request, not a completed purchase. I agree to the{" "}
              <Link href="/policies/terms" className="text-burgundy underline underline-offset-2">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/policies/privacy" className="text-burgundy underline underline-offset-2">
                privacy policy
              </Link>
              .
            </span>
          </label>

          {status === "error" && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] leading-relaxed text-burgundy"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className={cn("btn btn-primary mt-5 w-full", status === "sending" && "cursor-wait")}
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Placing request</span>
              </>
            ) : (
              <>
                <span>Place order request</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[8.5px] uppercase tracking-[0.14em] text-charcoal/35">
            <ShieldCheck className="h-3.5 w-3.5 text-botanical" />
            No payment is taken on this website
          </p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-[112px]">
        <div className="overflow-hidden rounded-2xl border border-forest/15 bg-ivory shadow-soft">
          <div className="flex items-center justify-between border-b border-forest/10 bg-cream/50 px-6 py-5">
            <div>
              <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Your basket</p>
              <h2 className="mt-1.5 font-serif text-[1.4rem] text-forest">
                {count} {count === 1 ? "item" : "items"}
              </h2>
            </div>
            <Link
              href="/cart"
              className="text-[8.5px] uppercase tracking-[0.14em] text-forest/50 underline underline-offset-4 hover:text-burgundy"
            >
              Edit
            </Link>
          </div>

          <ul className="max-h-[320px] divide-y divide-forest/10 overflow-y-auto px-5">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3 py-3.5">
                <div className="h-[68px] w-[54px] shrink-0 overflow-hidden rounded-md border border-forest/10">
                  <ProductArt
                    product={{
                      name: item.name,
                      theme: item.theme,
                      accent: item.accent,
                      image: item.image,
                      packs: [{ label: item.packLabel, grams: item.grams, price: item.price }],
                    }}
                    compact
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="font-serif text-[0.92rem] leading-tight text-forest">{item.name}</p>
                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-charcoal/40">
                    {item.packLabel} · {item.grams} g × {item.qty}
                  </p>
                  <p className="mt-auto text-[10.5px] text-forest">
                    {formatINR(item.price * item.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-forest/10 px-5 py-4">
            <div className="flex items-center gap-2 text-[9.5px] text-forest">
              <Truck className="h-3.5 w-3.5 text-gold" />
              {remaining > 0
                ? `Add ${formatINR(remaining)} more for free delivery.`
                : "Free delivery unlocked."}
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-forest/10">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} />
            </div>

            <dl className="mt-4 space-y-2 text-[11.5px]">
              <div className="flex justify-between text-charcoal/55">
                <dt>Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-charcoal/55">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between text-charcoal/40">
                <dt>Taxes</dt>
                <dd>Included</dd>
              </div>
              <div className="flex justify-between border-t border-forest/10 pt-2.5 text-[1.05rem] text-forest">
                <dt>Total</dt>
                <dd className="font-medium">{formatINR(total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 space-y-3 rounded-xl border border-forest/10 bg-cream/40 p-4">
          {[
            { icon: Leaf, text: "Real ingredients, packed in small batches." },
            { icon: ShieldCheck, text: "Your details are used only to fulfil this order." },
            { icon: MessageCircle, text: "A real person confirms every request personally." },
          ].map(({ icon: Icon, text }) => (
            <p key={text} className="flex items-start gap-2 text-[9.5px] leading-relaxed text-charcoal/50">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              {text}
            </p>
          ))}
        </div>

        <Link
          href="/cart"
          className="mt-4 inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-forest/55 hover:text-burgundy"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to basket
        </Link>
      </aside>
    </form>
  );
}
