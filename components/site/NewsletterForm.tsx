"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const dark = variant === "dark";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "You're on the list. Welcome to the pantry.");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4",
          dark ? "border-gold/30 bg-ivory/5 text-ivory" : "border-forest/15 bg-sage/40 text-forest",
        )}
        role="status"
      >
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-forest">
          <Check className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[13px] font-medium">Welcome to the pantry.</p>
          <p className={cn("mt-1 text-[11px] leading-relaxed", dark ? "text-ivory/60" : "text-charcoal/60")}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", compact ? "space-y-3" : "space-y-4")}>
      <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`newsletter-name-${variant}`} className="sr-only">
            Your name
          </label>
          <input
            id={`newsletter-name-${variant}`}
            className={cn(
              "field",
              dark && "border-ivory/15 bg-ivory/5 text-ivory placeholder:text-ivory/40 focus:bg-ivory/10",
            )}
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            className={cn(
              "field",
              dark && "border-ivory/15 bg-ivory/5 text-ivory placeholder:text-ivory/40 focus:bg-ivory/10",
            )}
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn("btn w-full", dark ? "btn-gold" : "btn-primary")}
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="arrow-slide h-4 w-4" />
        )}
        <span>{status === "loading" ? "Joining…" : "Join the list"}</span>
      </button>
      {status === "error" && (
        <p className="text-[11px] text-burgundy" role="alert">
          {message}
        </p>
      )}
      <p className={cn("text-[10px] leading-relaxed", dark ? "text-ivory/40" : "text-charcoal/45")}>
        A few good notes a month. No noise, no spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
