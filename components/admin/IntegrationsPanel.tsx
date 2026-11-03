"use client";

import {
  CircleAlert,
  CircleCheck,
  Cloud,
  Database,
  ExternalLink,
  GitBranch,
  MapPin,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { IntegrationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[7.5px] font-semibold uppercase tracking-[0.1em]",
        connected ? "bg-botanical/10 text-botanical" : "bg-gold/15 text-[#8a6f2d]",
      )}
    >
      {connected ? <CircleCheck className="h-3 w-3" /> : <CircleAlert className="h-3 w-3" />}
      {connected ? "Connected" : "Needs setup"}
    </span>
  );
}

function EnvChip({ name }: { name: string }) {
  return (
    <code className="rounded bg-cream px-1.5 py-0.5 text-[8px] text-charcoal/60">{name}</code>
  );
}

const envGroups = [
  {
    title: "Core",
    vars: [
      "ADMIN_PASSWORD",
      "ADMIN_SESSION_SECRET",
      "NEXT_PUBLIC_SITE_URL",
      "CRON_SECRET",
    ],
  },
  {
    title: "MongoDB Atlas",
    vars: ["MONGODB_URI", "MONGODB_DB"],
  },
  {
    title: "Cloudinary",
    vars: [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ],
  },
  {
    title: "Delhivery",
    vars: [
      "DELHIVERY_API_TOKEN",
      "DELHIVERY_CLIENT",
      "DELHIVERY_ENV",
      "DELHIVERY_SHIPPING_MODE",
      "DELHIVERY_PICKUP_NAME",
      "DELHIVERY_PICKUP_ADDRESS",
      "DELHIVERY_PICKUP_CITY",
      "DELHIVERY_PICKUP_PINCODE",
      "DELHIVERY_PICKUP_PHONE",
      "DELHIVERY_PICKUP_COUNTRY",
    ],
  },
];

export function IntegrationsPanel({ status }: { status: IntegrationStatus }) {
  const cards = [
    {
      name: "MongoDB Atlas",
      description:
        "Orders, products, enquiries, subscribers and content are stored in MongoDB so data survives Vercel deployments.",
      connected: status.mongodb,
      icon: Database,
      detail: status.mongodb ? "Database mode" : "Temporary JSON files",
      href: "https://cloud.mongodb.com",
    },
    {
      name: "Cloudinary",
      description:
        "Signed server-side uploads for product and hero imagery. No API secret ever reaches the browser.",
      connected: status.cloudinary,
      icon: Cloud,
      detail: status.cloudinary ? "Signed uploads on" : "Local uploads only",
      href: "https://console.cloudinary.com",
    },
    {
      name: "Delhivery",
      description:
        "Create waybills, sync scan history and move orders from packed to delivered automatically.",
      connected: status.delhivery && status.delhiveryPickup,
      icon: Truck,
      detail: status.delhivery
        ? status.delhiveryPickup
          ? `${status.delhiveryEnv} · ${status.delhiveryShippingMode}`
          : "Pickup address incomplete"
        : "API token missing",
      href: "https://delhivery-express-api-doc.readme.io",
    },
    {
      name: "Admin security",
      description:
        "Password and session secret are both set, so sessions are signed with your own key and cannot be forged.",
      connected: status.adminHardened,
      icon: ShieldCheck,
      detail: status.adminHardened ? "Custom secret" : "Development fallbacks",
      href: undefined,
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Platform</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
            Integrations
          </h1>
          <p className="mt-1 max-w-2xl text-[10.5px] leading-relaxed text-charcoal/45">
            Connection status for the services this pantry runs on. Secrets are read from
            environment variables and are never shown here.
          </p>
        </div>
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          <Rocket className="h-3.5 w-3.5" />
          <span>Deploy on Vercel</span>
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.name}
            className="rounded-xl border border-forest/10 bg-ivory p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-forest">
                <card.icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <StatusPill connected={card.connected} />
            </div>
            <h2 className="mt-4 font-serif text-[1.15rem] text-forest">{card.name}</h2>
            <p className="mt-1 text-[9.5px] leading-relaxed text-charcoal/50">
              {card.description}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-forest/10 pt-3">
              <span className="text-[8px] uppercase tracking-[0.1em] text-charcoal/40">
                {card.detail}
              </span>
              {card.href && (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${card.name}`}
                  className="text-charcoal/35 transition-colors hover:text-gold"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-[1.25rem] text-forest">Delhivery courier</h2>
              <p className="mt-1 text-[10px] text-charcoal/45">
                Pickup details must match the warehouse registered in your Delhivery account,
                including capitalisation.
              </p>
            </div>
            <Truck className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {[
              {
                icon: PackageCheck,
                label: "API access",
                value: status.delhivery ? "Token saved" : "Token missing",
                ok: status.delhivery,
              },
              {
                icon: MapPin,
                label: "Pickup warehouse",
                value: status.delhiveryPickup ? "Complete" : "Incomplete",
                ok: status.delhiveryPickup,
              },
              {
                icon: Truck,
                label: "Environment",
                value: status.delhiveryEnv,
                ok: true,
              },
              {
                icon: Rocket,
                label: "Shipping mode",
                value: status.delhiveryShippingMode,
                ok: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-lg border border-forest/10 bg-cream/30 px-3 py-2.5"
              >
                <row.icon className="h-3.5 w-3.5 shrink-0 text-charcoal/40" />
                <div className="min-w-0 flex-1">
                  <p className="text-[7.5px] uppercase tracking-[0.12em] text-charcoal/40">
                    {row.label}
                  </p>
                  <p className="truncate text-[10px] text-forest">{row.value}</p>
                </div>
                {row.ok ? (
                  <CircleCheck className="h-3.5 w-3.5 shrink-0 text-botanical" />
                ) : (
                  <CircleAlert className="h-3.5 w-3.5 shrink-0 text-gold" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-gold/25 bg-cream/50 px-4 py-3 text-[9px] leading-relaxed text-charcoal/50">
            <strong className="font-semibold text-forest">Automatic tracking:</strong> Vercel Cron
            calls <code className="rounded bg-ivory px-1">/api/cron/sync-shipments</code> daily when{" "}
            <EnvChip name="CRON_SECRET" /> is set. You can also sync any order manually from the
            Orders tab.
          </div>
        </section>

        <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
          <h2 className="font-serif text-[1.25rem] text-forest">Deployment pipeline</h2>
          <p className="mt-1 text-[10px] text-charcoal/45">
            Push to GitHub, let Vercel build, and keep secrets in the Vercel project.
          </p>

          <ol className="mt-4 space-y-3">
            {[
              { icon: GitBranch, label: "GitHub", detail: "Source of truth for every change." },
              { icon: Rocket, label: "Vercel", detail: status.vercel ? "Running on Vercel" : "Local or self-hosted." },
              { icon: Database, label: "MongoDB Atlas", detail: "Persistent production data." },
              { icon: Cloud, label: "Cloudinary", detail: "Product and content imagery." },
              { icon: Truck, label: "Delhivery", detail: "Waybills and delivery tracking." },
            ].map((step, index) => (
              <li key={step.label} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/40 text-[9px] font-semibold text-forest">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-forest">
                    <step.icon className="h-3 w-3 text-charcoal/35" /> {step.label}
                  </p>
                  <p className="text-[9px] leading-relaxed text-charcoal/45">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <a
            href={status.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.12em] text-burgundy hover:text-forest"
          >
            Open live storefront <ExternalLink className="h-3 w-3" />
          </a>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
        <h2 className="font-serif text-[1.25rem] text-forest">Environment variables</h2>
        <p className="mt-1 text-[10px] leading-relaxed text-charcoal/45">
          Add these in <strong className="font-medium text-forest">Vercel → Project → Settings → Environment Variables</strong>{" "}
          or in <code className="rounded bg-cream px-1">.env.local</code> for development. Redeploy
          after changing any value.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {envGroups.map((group) => (
            <div key={group.title} className="rounded-lg border border-forest/10 bg-cream/30 p-3">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gold">
                {group.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.vars.map((name) => (
                  <EnvChip key={name} name={name} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[9px] leading-relaxed text-charcoal/40">
          Use the same <code className="rounded bg-cream px-1">ADMIN_SESSION_SECRET</code> across
          deployments to keep sessions valid through a redeploy. Rotate the Delhivery token from
          Delhivery One if it is ever exposed.
        </p>
      </section>
    </div>
  );
}
