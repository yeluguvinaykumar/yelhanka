"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Please enter the studio password.");
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "That password does not match.");
      }

      router.replace(nextPath);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <p className="text-[8px] uppercase tracking-[0.3em] text-gold">Private entrance</p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,2.6rem)] leading-[1.05] text-forest">
        Welcome back to
        <span className="block italic text-botanical">the studio.</span>
      </h1>
      <p className="mt-4 text-[12px] leading-[1.8] text-charcoal/55">
        Enter the studio password to manage products, orders, enquiries and the words on the
        storefront.
      </p>

      <div className="mt-8">
        <label htmlFor="admin-password" className="field-label">
          Studio password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            autoComplete="current-password"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-password-error" : undefined}
            className={cn("field pr-12", error && "border-burgundy/60 focus:border-burgundy")}
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-charcoal/40 transition-colors hover:text-forest"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && (
          <p
            id="admin-password-error"
            role="alert"
            className="mt-2 rounded-md border border-burgundy/20 bg-burgundy/5 px-3 py-2 text-[10px] leading-relaxed text-burgundy"
          >
            {error}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full">
        <span className="relative z-10 flex items-center justify-center gap-2">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening the studio
            </>
          ) : (
            <>
              Enter the studio
              <ArrowRight className="arrow-slide h-4 w-4" />
            </>
          )}
        </span>
      </button>

      <p className="mt-6 flex items-start gap-2 text-[9px] leading-relaxed text-charcoal/40">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-botanical/60" strokeWidth={1.6} />
        Sessions last eight hours and are signed with a secure, HTTP-only cookie. If you have
        forgotten the password, update <code className="text-charcoal/60">ADMIN_PASSWORD</code> in
        the environment and restart the server.
      </p>
    </form>
  );
}
