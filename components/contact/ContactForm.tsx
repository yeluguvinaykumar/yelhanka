"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { cn, waLink } from "@/lib/utils";

const subjects = [
  "General enquiry",
  "Product question",
  "Order support",
  "Wholesale & gifting",
  "Press",
  "Something else",
];

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ initialSubject }: { initialSubject?: string }) {
  const site = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const initial = subjects.find(
    (subject) => subject.toLowerCase() === initialSubject?.toLowerCase(),
  );
  const [subject, setSubject] = useState(initial ?? subjects[0]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [reference, setReference] = useState("");

  const setField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject }),
      });
      const data = (await response.json()) as {
        enquiry?: { id: string };
        message?: string;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || "We couldn't send your message just now.");
      }
      setReference(data.enquiry?.id.slice(-6).toUpperCase() ?? "");
      setMessage(data.message || "Thank you — your message is with us.");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gold/30 bg-ivory px-6 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-cream">
          <Check className="h-7 w-7 text-botanical" strokeWidth={1.8} />
        </span>
        <h2 className="mt-6 font-serif text-[2rem] text-forest">Message received.</h2>
        <p className="mt-2 max-w-sm text-[12px] leading-[1.8] text-charcoal/55">{message}</p>
        {reference && (
          <p className="mt-4 rounded-full border border-forest/10 bg-cream px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-charcoal/45">
            Reference · {reference}
          </p>
        )}
        <p className="mt-6 text-[11px] leading-relaxed text-charcoal/45">
          We usually reply within one working day. Need something sooner?
        </p>
        <a
          href={waLink(site.whatsapp, "Hi Tasty Treasures! I just sent a message through the website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm mt-4"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat on WhatsApp</span>
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-[9px] uppercase tracking-[0.16em] text-forest/50 underline underline-offset-4 hover:text-forest"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-forest/10 bg-ivory p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Write to the studio</p>
          <h2 className="mt-2 font-serif text-[clamp(1.7rem,3vw,2.2rem)] leading-tight text-forest">
            Tell us what you need.
          </h2>
        </div>
        <span className="script hidden text-[1.6rem] leading-none text-burgundy/70 sm:block">
          hello!
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">Your name *</label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            className="field"
            placeholder="First and last name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">Email *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="field-label">Phone (optional)</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            className="field"
            placeholder="+91"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="field-label">Subject</label>
          <select
            id="contact-subject"
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="field appearance-none"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="field-label">Your message *</label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          className="field"
          placeholder="A little detail helps us help you — product, quantity, pincode or anything else."
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] leading-relaxed text-burgundy"
        >
          {error || "We couldn't send your message. Please try WhatsApp instead."}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[9px] leading-relaxed text-charcoal/40">
          By sending this form you agree to our{" "}
          <a href="/policies/privacy" className="underline underline-offset-2 hover:text-forest">
            privacy policy
          </a>
          . We only use your details to reply.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn("btn btn-primary shrink-0", status === "sending" && "cursor-wait")}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
