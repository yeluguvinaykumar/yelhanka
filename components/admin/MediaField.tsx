"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  label?: string;
};

/**
 * Image control used across the studio. Uploads go through the signed
 * Cloudinary route when it is configured and fall back to /public/uploads
 * locally. Pasting an external URL is always allowed.
 */
export function MediaField({ value, onChange, folder, label = "Image" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<"cloudinary" | "local" | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      if (folder) body.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as {
        url?: string;
        provider?: "cloudinary" | "local";
        error?: string;
      };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Upload failed.");
      }
      onChange(data.url);
      setProvider(data.provider ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        <div className="relative h-[74px] w-[60px] shrink-0 overflow-hidden rounded-md border border-forest/10 bg-cream">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-forest/20">
              <ImageIcon className="h-5 w-5" />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-ivory/80">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-forest/15 bg-ivory px-2.5 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-forest transition-colors hover:border-gold">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {uploading ? "Uploading" : value ? "Replace" : "Upload"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) upload(file);
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setProvider(null);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-forest/10 px-2.5 py-2 text-[8px] uppercase tracking-[0.1em] text-burgundy/70 transition-colors hover:border-burgundy/30 hover:text-burgundy"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
            {provider && (
              <span className="text-[8px] uppercase tracking-[0.1em] text-botanical/70">
                Saved to {provider}
              </span>
            )}
          </div>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="field h-9 text-[10px]"
            placeholder="https://res.cloudinary.com/... or /images/..."
            aria-label={`${label} URL`}
          />
        </div>
      </div>

      <p className="mt-1.5 text-[8.5px] leading-relaxed text-charcoal/40">
        JPG, PNG, WebP or AVIF under 5&nbsp;MB. Cloudinary signs every upload; without
        Cloudinary keys the image is saved to <code>public/uploads</code> for local development.
      </p>
      {error && (
        <p role="alert" className="mt-1.5 text-[9px] leading-relaxed text-burgundy">
          {error}
        </p>
      )}
    </div>
  );
}
