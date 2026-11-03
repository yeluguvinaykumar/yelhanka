"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type {
  Accent,
  Benefit,
  CategoryId,
  Product,
  ProductTheme,
  ProductType,
} from "@/lib/types";
import { ProductArt } from "@/components/commerce/ProductArt";
import { MediaField } from "@/components/admin/MediaField";
import { cn, formatINR, slugify } from "@/lib/utils";

const categoryOptions: { value: CategoryId; label: string }[] = [
  { value: "freeze-dried-fruits", label: "Freeze-Dried Fruits" },
  { value: "dehydrated-chips", label: "Dehydrated Chips" },
  { value: "superfood-powders", label: "Superfood Powders" },
  { value: "gift-combos", label: "Gift Combos" },
];

const typeOptions: ProductType[] = ["Fruits", "Vegetables", "Powders", "Chips", "Combos"];
const benefitOptions: Benefit[] = ["Immunity", "Energy", "Digestion", "Skin & Hair", "Overall Wellness"];
const accentOptions: Accent[] = ["forest", "burgundy", "gold", "moss"];
const themeOptions: ProductTheme[] = [
  "strawberry", "mango", "kiwi", "banana", "okra", "beet", "sweet-potato",
  "kale", "berry", "pineapple", "powder", "moringa", "gift",
];

type PackDraft = { label: string; grams: string; price: string; compareAt: string };
type NutritionDraft = { label: string; value: string };

type Draft = {
  name: string;
  slug: string;
  category: CategoryId;
  type: ProductType;
  benefits: Benefit[];
  short: string;
  description: string;
  ingredients: string;
  storage: string;
  usage: string;
  packs: PackDraft[];
  nutrition: NutritionDraft[];
  stock: string;
  featured: boolean;
  badge: string;
  accent: Accent;
  theme: ProductTheme;
  image: string;
};

function toDraft(product?: Product): Draft {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "freeze-dried-fruits",
    type: product?.type ?? "Fruits",
    benefits: product?.benefits ?? [],
    short: product?.short ?? "",
    description: product?.description ?? "",
    ingredients: product?.ingredients ?? "",
    storage: product?.storage ?? "",
    usage: product?.usage.join("\n") ?? "",
    packs:
      product?.packs.map((pack) => ({
        label: pack.label,
        grams: String(pack.grams),
        price: String(pack.price),
        compareAt: pack.compareAt ? String(pack.compareAt) : "",
      })) ?? [{ label: "Pouch", grams: "100", price: "", compareAt: "" }],
    nutrition:
      product?.nutrition.map((row) => ({ label: row.label, value: row.value })) ?? [
        { label: "Energy", value: "" },
      ],
    stock: String(product?.stock ?? 0),
    featured: product?.featured ?? false,
    badge: product?.badge ?? "",
    accent: product?.accent ?? "forest",
    theme: product?.theme ?? "gift",
    image: product?.image ?? "",
  };
}

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

function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product?: Product;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const preview = useMemo(
    () => ({
      name: draft.name || "New product",
      theme: draft.theme,
      accent: draft.accent,
      image: draft.image || undefined,
      packs: [{ label: draft.packs[0]?.label || "Pouch", grams: 100, price: 0 }],
    }),
    [draft.name, draft.theme, draft.accent, draft.image, draft.packs],
  );

  const update = <Key extends keyof Draft>(key: Key, value: Draft[Key]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const updatePack = (index: number, field: keyof PackDraft, value: string) =>
    setDraft((current) => ({
      ...current,
      packs: current.packs.map((pack, packIndex) =>
        packIndex === index ? { ...pack, [field]: value } : pack,
      ),
    }));

  const updateNutrition = (index: number, field: keyof NutritionDraft, value: string) =>
    setDraft((current) => ({
      ...current,
      nutrition: current.nutrition.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const packs = draft.packs
      .map((pack) => ({
        label: pack.label.trim(),
        grams: Number(pack.grams),
        price: Number(pack.price),
        compareAt: pack.compareAt ? Number(pack.compareAt) : undefined,
      }))
      .filter((pack) => pack.label && pack.grams > 0 && pack.price > 0);

    if (draft.name.trim().length < 2) {
      setError("Please give the product a name.");
      return;
    }
    if (packs.length === 0) {
      setError("Add at least one pack with a label, weight and price.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        slug: draft.slug.trim() || slugify(draft.name),
        category: draft.category,
        type: draft.type,
        benefits: draft.benefits,
        short: draft.short.trim(),
        description: draft.description.trim(),
        ingredients: draft.ingredients.trim(),
        storage: draft.storage.trim(),
        usage: draft.usage.split("\n").map((item) => item.trim()).filter(Boolean),
        packs,
        nutrition: draft.nutrition
          .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
          .filter((row) => row.label && row.value),
        stock: Math.max(0, Math.round(Number(draft.stock) || 0)),
        featured: draft.featured,
        badge: draft.badge.trim() || undefined,
        accent: draft.accent,
        theme: draft.theme,
        image: draft.image.trim() || undefined,
      };

      const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { product?: Product; error?: string };
      if (!response.ok || !data.product) {
        throw new Error(data.error || "Could not save the product.");
      }
      onSaved(data.product);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <button
        type="button"
        aria-label="Close editor"
        onClick={onClose}
        className="absolute inset-0 bg-forest/40 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-cream shadow-lift">
        <div className="flex items-start justify-between gap-4 border-b border-forest/10 bg-ivory px-5 py-4 sm:px-7">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-gold">
              {product ? "Edit product" : "New product"}
            </p>
            <h2 className="mt-1 font-serif text-[1.5rem] leading-tight text-forest">
              {product ? product.name : "Add to the pantry"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-forest/15 text-forest hover:border-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
            <div>
              <p className="field-label">Artwork</p>
              <div className="aspect-[3/4] overflow-hidden rounded-lg border border-forest/10 bg-ivory">
                <ProductArt product={preview} compact />
              </div>
              <p className="mt-2 text-center text-[8px] uppercase tracking-[0.1em] text-charcoal/35">
                Live artwork preview
              </p>
            </div>

            <div className="space-y-4">
              <Field label="Product name *">
                <input
                  value={draft.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setDraft((current) => ({
                      ...current,
                      name,
                      slug:
                        !current.slug || current.slug === slugify(current.name)
                          ? slugify(name)
                          : current.slug,
                    }));
                  }}
                  className="field"
                  placeholder="Freeze-Dried Strawberries"
                />
              </Field>
              <Field label="URL slug" hint="Lowercase words separated by hyphens.">
                <input
                  value={draft.slug}
                  onChange={(event) => update("slug", slugify(event.target.value))}
                  className="field"
                  placeholder="freeze-dried-strawberries"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <select
                    value={draft.category}
                    onChange={(event) => update("category", event.target.value as CategoryId)}
                    className="field appearance-none"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Type">
                  <select
                    value={draft.type}
                    onChange={(event) => update("type", event.target.value as ProductType)}
                    className="field appearance-none"
                  >
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-forest/10 pt-5">
            <Field label="Short description" hint="One line shown on product cards.">
              <input
                value={draft.short}
                onChange={(event) => update("short", event.target.value)}
                className="field"
                placeholder="Whole strawberries with a bright, airy crunch."
              />
            </Field>
            <Field label="Full description">
              <textarea
                rows={4}
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                className="field"
                placeholder="Tell the story of the ingredient and the process."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ingredients">
                <textarea
                  rows={3}
                  value={draft.ingredients}
                  onChange={(event) => update("ingredients", event.target.value)}
                  className="field"
                  placeholder="100% strawberries."
                />
              </Field>
              <Field label="Storage">
                <textarea
                  rows={3}
                  value={draft.storage}
                  onChange={(event) => update("storage", event.target.value)}
                  className="field"
                  placeholder="Store sealed in a cool, dry place."
                />
              </Field>
            </div>
            <Field label="How to enjoy" hint="One idea per line.">
              <textarea
                rows={3}
                value={draft.usage}
                onChange={(event) => update("usage", event.target.value)}
                className="field"
                placeholder={"Straight from the pouch\nCrushed over yoghurt"}
              />
            </Field>
          </div>

          <div className="mt-6 border-t border-forest/10 pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="field-label mb-0">Packs &amp; pricing</p>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    packs: [
                      ...current.packs,
                      { label: "", grams: "", price: "", compareAt: "" },
                    ].slice(0, 5),
                  }))
                }
                className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy"
              >
                <Plus className="h-3 w-3" /> Add pack
              </button>
            </div>
            <div className="mt-2 space-y-2.5">
              {draft.packs.map((pack, index) => (
                <div key={index} className="rounded-lg border border-forest/10 bg-ivory p-3">
                  <div className="grid gap-2 sm:grid-cols-[1.3fr_0.7fr_0.9fr_0.9fr_auto]">
                    <input
                      value={pack.label}
                      onChange={(event) => updatePack(index, "label", event.target.value)}
                      className="field h-10 text-[11px]"
                      placeholder="Pack label"
                      aria-label={`Pack ${index + 1} label`}
                    />
                    <input
                      value={pack.grams}
                      onChange={(event) => updatePack(index, "grams", event.target.value.replace(/\D/g, ""))}
                      className="field h-10 text-[11px]"
                      placeholder="Grams"
                      inputMode="numeric"
                      aria-label={`Pack ${index + 1} grams`}
                    />
                    <input
                      value={pack.price}
                      onChange={(event) => updatePack(index, "price", event.target.value.replace(/[^\d.]/g, ""))}
                      className="field h-10 text-[11px]"
                      placeholder="Price ₹"
                      inputMode="decimal"
                      aria-label={`Pack ${index + 1} price`}
                    />
                    <input
                      value={pack.compareAt}
                      onChange={(event) => updatePack(index, "compareAt", event.target.value.replace(/[^\d.]/g, ""))}
                      className="field h-10 text-[11px]"
                      placeholder="Compare ₹"
                      inputMode="decimal"
                      aria-label={`Pack ${index + 1} compare-at price`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          packs:
                            current.packs.length > 1
                              ? current.packs.filter((_, packIndex) => packIndex !== index)
                              : current.packs,
                        }))
                      }
                      disabled={draft.packs.length <= 1}
                      aria-label={`Remove pack ${index + 1}`}
                      className="grid h-10 w-10 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-forest/10 pt-5 sm:grid-cols-2">
            <Field label="Stock" hint="Total units available across packs.">
              <input
                value={draft.stock}
                onChange={(event) => update("stock", event.target.value.replace(/\D/g, ""))}
                className="field"
                inputMode="numeric"
                placeholder="0"
              />
            </Field>
            <Field label="Badge (optional)" hint="For example: Best seller, No added sugar.">
              <input
                value={draft.badge}
                onChange={(event) => update("badge", event.target.value)}
                className="field"
                placeholder="Best seller"
              />
            </Field>
            <Field label="Accent colour">
              <select
                value={draft.accent}
                onChange={(event) => update("accent", event.target.value as Accent)}
                className="field appearance-none capitalize"
              >
                {accentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Pouch illustration">
              <select
                value={draft.theme}
                onChange={(event) => update("theme", event.target.value as ProductTheme)}
                className="field appearance-none capitalize"
              >
                {themeOptions.map((option) => (
                  <option key={option} value={option}>{option.replace("-", " ")}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Product image"
              hint="Leave blank to use the branded pouch illustration. Cloudinary uploads are signed on the server."
              className="sm:col-span-2"
            >
              <MediaField
                value={draft.image}
                onChange={(value) => update("image", value)}
                folder="products"
                label={`${draft.name || "Product"} image`}
              />
            </Field>
          </div>

          <div className="mt-6 border-t border-forest/10 pt-5">
            <p className="field-label">Benefits</p>
            <div className="flex flex-wrap gap-2">
              {benefitOptions.map((benefit) => {
                const active = draft.benefits.includes(benefit);
                return (
                  <button
                    key={benefit}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      update(
                        "benefits",
                        active
                          ? draft.benefits.filter((item) => item !== benefit)
                          : [...draft.benefits, benefit],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] transition-colors",
                      active
                        ? "border-forest bg-forest text-ivory"
                        : "border-forest/15 text-charcoal/50 hover:border-gold",
                    )}
                  >
                    {benefit}
                  </button>
                );
              })}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[11px] text-charcoal/60">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => update("featured", event.target.checked)}
                className="h-4 w-4 accent-forest"
              />
              Feature this product on the home page and shop.
            </label>
          </div>

          <div className="mt-6 border-t border-forest/10 pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="field-label mb-0">Nutrition rows</p>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    nutrition: [...current.nutrition, { label: "", value: "" }].slice(0, 12),
                  }))
                }
                className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy"
              >
                <Plus className="h-3 w-3" /> Add row
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {draft.nutrition.map((row, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    value={row.label}
                    onChange={(event) => updateNutrition(index, "label", event.target.value)}
                    className="field h-10 text-[11px]"
                    placeholder="Energy"
                    aria-label={`Nutrition row ${index + 1} label`}
                  />
                  <input
                    value={row.value}
                    onChange={(event) => updateNutrition(index, "value", event.target.value)}
                    className="field h-10 text-[11px]"
                    placeholder="342 kcal"
                    aria-label={`Nutrition row ${index + 1} value`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        nutrition: current.nutrition.filter((_, rowIndex) => rowIndex !== index),
                      }))
                    }
                    aria-label={`Remove nutrition row ${index + 1}`}
                    className="grid h-10 w-10 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] leading-relaxed text-burgundy"
            >
              {error}
            </p>
          )}

          <div className="sticky bottom-0 -mx-5 mt-6 flex items-center justify-between gap-3 border-t border-forest/10 bg-cream/95 px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="text-[9px] uppercase tracking-[0.14em] text-charcoal/45 hover:text-forest"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm min-w-[150px]">
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving</span>
                </>
              ) : (
                <>
                  <Package className="h-3.5 w-3.5" />
                  <span>{product ? "Save changes" : "Add product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProductsPanel({
  products,
  onChange,
}: {
  products: Product[];
  onChange: (products: Product[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");
  const [editor, setEditor] = useState<{ mode: "new" } | { mode: "edit"; product: Product } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.slug.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [products, query, category]);

  const toggleFeatured = async (product: Product) => {
    setBusyId(product.id);
    setError("");
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !product.featured }),
      });
      const data = (await response.json()) as { product?: Product; error?: string };
      if (!response.ok || !data.product) throw new Error(data.error || "Could not update product.");
      onChange(products.map((item) => (item.id === product.id ? data.product! : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update product.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setBusyId(product.id);
    setError("");
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not delete product.");
      onChange(products.filter((item) => item.id !== product.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete product.");
    } finally {
      setBusyId(null);
    }
  };

  const saved = (product: Product) => {
    const exists = products.some((item) => item.id === product.id);
    onChange(exists ? products.map((item) => (item.id === product.id ? product : item)) : [product, ...products]);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Catalogue</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
            Products
          </h1>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            {products.length} products · {products.filter((product) => product.stock <= 5).length} low stock
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditor({ mode: "new" })}
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add product</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field h-11 pl-10 text-[12px]"
            placeholder="Search by name or slug"
            aria-label="Search products"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as "all" | CategoryId)}
          className="field h-11 w-full appearance-none text-[11px] sm:w-56"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] text-burgundy">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-hidden rounded-xl border border-forest/10 bg-ivory">
        <div className="hidden grid-cols-[1fr_135px_100px_110px_130px] gap-4 border-b border-forest/10 bg-cream/50 px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-charcoal/40 lg:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Package className="mx-auto h-8 w-8 text-forest/20" />
            <p className="mt-3 font-serif text-[1.3rem] text-forest">No products match.</p>
            <p className="mt-1 text-[10.5px] text-charcoal/45">Try another search or category.</p>
          </div>
        ) : (
          <ul className="divide-y divide-forest/10">
            {filtered.map((product) => {
              const pack = product.packs[0];
              return (
                <li
                  key={product.id}
                  className="grid gap-3 px-4 py-4 transition-colors hover:bg-cream/30 sm:px-5 lg:grid-cols-[1fr_135px_100px_110px_130px] lg:items-center lg:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-[62px] w-[48px] shrink-0 overflow-hidden rounded-md border border-forest/10">
                      <ProductArt product={product} compact />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-serif text-[1rem] text-forest">{product.name}</p>
                        {product.featured && <Star className="h-3 w-3 shrink-0 fill-gold text-gold" />}
                      </div>
                      <p className="mt-0.5 truncate text-[8.5px] text-charcoal/40">/{product.slug}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[8px] uppercase tracking-[0.08em] text-charcoal/40 lg:hidden">
                        <span>{categoryOptions.find((item) => item.value === product.category)?.label}</span>
                        <span>·</span>
                        <span>{formatINR(pack?.price ?? 0)}</span>
                        <span>·</span>
                        <span className={product.stock <= 5 ? "text-burgundy" : ""}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="hidden text-[10px] leading-tight text-charcoal/50 lg:block">
                    {categoryOptions.find((item) => item.value === product.category)?.label}
                  </span>
                  <div className="hidden lg:block">
                    <p className="text-[11px] text-forest">{formatINR(pack?.price ?? 0)}</p>
                    <p className="text-[8px] text-charcoal/35">{pack?.grams} g</p>
                  </div>
                  <div className="hidden lg:block">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] uppercase tracking-[0.08em]",
                        product.stock <= 0
                          ? "bg-burgundy/10 text-burgundy"
                          : product.stock <= 5
                            ? "bg-gold/15 text-[#8a6f2d]"
                            : "bg-botanical/10 text-botanical",
                      )}
                    >
                      <span className="h-1 w-1 rounded-full bg-current" />
                      {product.stock <= 0 ? "Out" : `${product.stock} left`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 border-t border-forest/5 pt-2.5 lg:justify-end lg:border-0 lg:pt-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(product)}
                        disabled={busyId === product.id}
                        aria-label={product.featured ? `Unfeature ${product.name}` : `Feature ${product.name}`}
                        title={product.featured ? "Remove from featured" : "Feature product"}
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-md border transition-colors",
                          product.featured
                            ? "border-gold/50 bg-gold/10 text-gold"
                            : "border-forest/10 text-charcoal/35 hover:border-gold hover:text-gold",
                        )}
                      >
                        <Star className={cn("h-3.5 w-3.5", product.featured && "fill-current")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditor({ mode: "edit", product })}
                        aria-label={`Edit ${product.name}`}
                        className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/45 hover:border-forest hover:text-forest"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(product)}
                        disabled={busyId === product.id}
                        aria-label={`Delete ${product.name}`}
                        className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-40"
                      >
                        {busyId === product.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <a
                        href={`/shop/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${product.name} on the storefront`}
                        className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-forest hover:text-forest"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-[9px] leading-relaxed text-charcoal/35">
        <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
        Uploads go to Cloudinary when it is configured, so they survive Vercel deployments. Leave the
        image blank to use the branded pouch artwork.
      </p>

      {editor && (
        <ProductEditor
          product={editor.mode === "edit" ? editor.product : undefined}
          onClose={() => setEditor(null)}
          onSaved={saved}
        />
      )}
    </div>
  );
}
