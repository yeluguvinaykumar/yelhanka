"use client";

import { useState } from "react";
import { Info, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/types";
import { MediaField } from "@/components/admin/MediaField";
import { cn, formatINR } from "@/lib/utils";

type Tab = "studio" | "home" | "story";

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[9px] leading-relaxed text-charcoal/40">{hint}</span>}
    </label>
  );
}

function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

export function ContentPanel({
  content,
  onSaved,
}: {
  content: SiteContent;
  onSaved: (content: SiteContent) => void;
}) {
  const [tab, setTab] = useState<Tab>("studio");
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(content));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const updateSite = <Key extends keyof SiteContent["site"],>(
    key: Key,
    value: SiteContent["site"][Key],
  ) => setDraft((current) => ({ ...current, site: { ...current.site, [key]: value } }));

  const updateHero = <Key extends keyof SiteContent["hero"],>(
    key: Key,
    value: SiteContent["hero"][Key],
  ) => setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }));

  const updateAbout = <Key extends keyof SiteContent["about"],>(
    key: Key,
    value: SiteContent["about"][Key],
  ) => setDraft((current) => ({ ...current, about: { ...current.about, [key]: value } }));

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json()) as { content?: SiteContent; error?: string };
      if (!response.ok || !data.content) {
        throw new Error(data.error || "Could not save the content.");
      }
      setDraft(data.content);
      onSaved(data.content);
      setMessage("Saved. Storefront pages update on their next load.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the content.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDraft(cloneContent(content));
    setError("");
    setMessage("");
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Storefront</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
            Content &amp; settings
          </h1>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            Contact details, announcements, hero copy and the story behind the pantry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="text-[9px] uppercase tracking-[0.12em] text-charcoal/45 hover:text-burgundy"
            >
              Reset
            </button>
          )}
          <button type="button" onClick={save} disabled={saving || !dirty} className="btn btn-primary btn-sm">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-1 overflow-x-auto border-b border-forest/10">
        {[
          { value: "studio" as const, label: "Studio details" },
          { value: "home" as const, label: "Home page" },
          { value: "story" as const, label: "Story & stats" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors",
              tab === item.value
                ? "border-gold text-forest"
                : "border-transparent text-charcoal/40 hover:text-forest",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-4 rounded-lg border border-botanical/25 bg-botanical/5 px-4 py-3 text-[11px] text-botanical">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] text-burgundy">
          {error}
        </p>
      )}

      {tab === "studio" && (
        <div className="mt-5 space-y-6">
          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <h2 className="font-serif text-[1.25rem] text-forest">The studio</h2>
            <p className="mt-1 text-[10px] text-charcoal/45">
              These details appear in the footer, contact page, policies and WhatsApp links.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Brand name">
                <input
                  value={draft.site.name}
                  onChange={(event) => updateSite("name", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={draft.site.tagline}
                  onChange={(event) => updateSite("tagline", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={draft.site.email}
                  onChange={(event) => updateSite("email", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={draft.site.phone}
                  onChange={(event) => updateSite("phone", event.target.value)}
                  className="field"
                  placeholder="+91 98765 43210"
                />
              </Field>
              <Field
                label="WhatsApp number"
                hint="Digits only, including the country code. Used for every WhatsApp order link."
              >
                <input
                  value={draft.site.whatsapp}
                  onChange={(event) => updateSite("whatsapp", event.target.value.replace(/\D/g, ""))}
                  className="field"
                  placeholder="919876543210"
                />
              </Field>
              <Field label="Studio hours">
                <input
                  value={draft.site.hours}
                  onChange={(event) => updateSite("hours", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={draft.site.address}
                  onChange={(event) => updateSite("address", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Instagram URL">
                <input
                  value={draft.site.instagram}
                  onChange={(event) => updateSite("instagram", event.target.value)}
                  className="field"
                  placeholder="https://instagram.com/..."
                />
              </Field>
              <Field label="Facebook URL">
                <input
                  value={draft.site.facebook}
                  onChange={(event) => updateSite("facebook", event.target.value)}
                  className="field"
                  placeholder="https://facebook.com/..."
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <h2 className="font-serif text-[1.25rem] text-forest">Shipping settings</h2>
            <p className="mt-1 text-[10px] text-charcoal/45">
              Used in the basket, checkout and shipping policy. The current free-delivery threshold is{" "}
              {formatINR(draft.site.freeShippingThreshold)}.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Free delivery threshold (₹)">
                <input
                  type="number"
                  min={0}
                  value={draft.site.freeShippingThreshold}
                  onChange={(event) => updateSite("freeShippingThreshold", Number(event.target.value) || 0)}
                  className="field"
                />
              </Field>
              <Field label="Flat shipping fee (₹)">
                <input
                  type="number"
                  min={0}
                  value={draft.site.shippingFee}
                  onChange={(event) => updateSite("shippingFee", Number(event.target.value) || 0)}
                  className="field"
                />
              </Field>
            </div>
          </section>
        </div>
      )}

      {tab === "home" && (
        <div className="mt-5 space-y-6">
          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <h2 className="font-serif text-[1.25rem] text-forest">Hero</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <input
                  value={draft.hero.eyebrow}
                  onChange={(event) => updateHero("eyebrow", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Hero image" className="sm:col-span-2">
                <MediaField
                  value={draft.hero.image}
                  onChange={(value) => updateHero("image", value)}
                  folder="content"
                  label="Hero image"
                />
              </Field>
              <Field label="Title · first line">
                <input
                  value={draft.hero.titleTop}
                  onChange={(event) => updateHero("titleTop", event.target.value)}
                  className="field uppercase"
                />
              </Field>
              <Field label="Title · second line">
                <input
                  value={draft.hero.titleBottom}
                  onChange={(event) => updateHero("titleBottom", event.target.value)}
                  className="field uppercase"
                />
              </Field>
              <Field label="Hero description" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={draft.hero.description}
                  onChange={(event) => updateHero("description", event.target.value)}
                  className="field"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-[1.25rem] text-forest">Announcement bar</h2>
                <p className="mt-1 text-[10px] text-charcoal/45">
                  Short messages that rotate at the top of the storefront. Maximum six.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    announcements: [...current.announcements, ""].slice(0, 6),
                  }))
                }
                className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {draft.announcements.map((announcement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={announcement}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        announcements: current.announcements.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      }))
                    }
                    className="field h-10 text-[11px]"
                    aria-label={`Announcement ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        announcements:
                          current.announcements.length > 1
                            ? current.announcements.filter((_, itemIndex) => itemIndex !== index)
                            : current.announcements,
                      }))
                    }
                    disabled={draft.announcements.length <= 1}
                    aria-label={`Remove announcement ${index + 1}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "story" && (
        <div className="mt-5 space-y-6">
          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <h2 className="font-serif text-[1.25rem] text-forest">The story</h2>
            <div className="mt-5 space-y-4">
              <Field label="Story">
                <textarea
                  rows={6}
                  value={draft.about.story}
                  onChange={(event) => updateAbout("story", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Mission">
                <textarea
                  rows={3}
                  value={draft.about.mission}
                  onChange={(event) => updateAbout("mission", event.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Vision">
                <textarea
                  rows={3}
                  value={draft.about.vision}
                  onChange={(event) => updateAbout("vision", event.target.value)}
                  className="field"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-forest/10 bg-ivory p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-[1.25rem] text-forest">Studio statistics</h2>
                <p className="mt-1 text-[10px] text-charcoal/45">
                  Keep these factual. They are qualitative process claims, not customer counts.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    stats: [
                      ...current.stats,
                      { value: 0, prefix: "", suffix: "", label: "", detail: "" },
                    ].slice(0, 6),
                  }))
                }
                className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {draft.stats.map((stat, index) => (
                <div key={index} className="rounded-lg border border-forest/10 bg-cream/30 p-3">
                  <div className="grid gap-2 sm:grid-cols-[70px_70px_70px_1fr_auto]">
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, value: Number(event.target.value) || 0 }
                              : item,
                          ),
                        }))
                      }
                      className="field h-10 text-[11px]"
                      aria-label={`Stat ${index + 1} value`}
                    />
                    <input
                      value={stat.prefix ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, prefix: event.target.value } : item,
                          ),
                        }))
                      }
                      className="field h-10 text-[11px]"
                      placeholder="Prefix"
                      aria-label={`Stat ${index + 1} prefix`}
                    />
                    <input
                      value={stat.suffix ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, suffix: event.target.value } : item,
                          ),
                        }))
                      }
                      className="field h-10 text-[11px]"
                      placeholder="Suffix"
                      aria-label={`Stat ${index + 1} suffix`}
                    />
                    <input
                      value={stat.label}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, label: event.target.value } : item,
                          ),
                        }))
                      }
                      className="field h-10 text-[11px]"
                      placeholder="Label"
                      aria-label={`Stat ${index + 1} label`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          stats:
                            current.stats.length > 1
                              ? current.stats.filter((_, itemIndex) => itemIndex !== index)
                              : current.stats,
                        }))
                      }
                      disabled={draft.stats.length <= 1}
                      aria-label={`Remove stat ${index + 1}`}
                      className="grid h-10 w-10 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    value={stat.detail}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        stats: current.stats.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, detail: event.target.value } : item,
                        ),
                      }))
                    }
                    className="field mt-2 h-10 text-[11px]"
                    placeholder="Supporting detail"
                    aria-label={`Stat ${index + 1} detail`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 rounded-lg border border-gold/25 bg-cream/50 px-4 py-3 text-[9px] leading-relaxed text-charcoal/45">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
        Content is stored in MongoDB when <code className="rounded bg-ivory px-1">MONGODB_URI</code> is
        set, and in <code className="rounded bg-ivory px-1">data/content.json</code> locally. Once
        saved, open the storefront in a new tab to see the change. The WhatsApp number must be digits
        only, including the country code.
      </p>
    </div>
  );
}
