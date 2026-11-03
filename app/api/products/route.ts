import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import type {
  Accent,
  Benefit,
  CategoryId,
  Pack,
  Product,
  ProductTheme,
  ProductType,
} from "@/lib/types";

const CATEGORIES: CategoryId[] = [
  "freeze-dried-fruits",
  "dehydrated-chips",
  "superfood-powders",
  "gift-combos",
];
const TYPES: ProductType[] = ["Fruits", "Vegetables", "Powders", "Chips", "Combos"];
const BENEFITS: Benefit[] = ["Immunity", "Energy", "Digestion", "Skin & Hair", "Overall Wellness"];
const ACCENTS: Accent[] = ["forest", "burgundy", "gold", "moss"];
const THEMES: ProductTheme[] = [
  "strawberry", "mango", "kiwi", "banana", "okra", "beet", "sweet-potato",
  "kale", "berry", "pineapple", "powder", "moringa", "gift",
];

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function number(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function cleanPacks(value: unknown): Pack[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const pack = entry as Partial<Pack>;
      return {
        label: text(pack.label),
        grams: number(pack.grams),
        price: number(pack.price),
        compareAt: pack.compareAt ? number(pack.compareAt) : undefined,
      };
    })
    .filter((pack) => pack.label.length > 0 && pack.grams > 0 && pack.price > 0)
    .slice(0, 5);
}

function cleanProduct(input: Partial<Product>, existing?: Product): Product {
  const name = text(input.name, existing?.name);
  const packs = cleanPacks(input.packs ?? existing?.packs);
  if (!name || packs.length === 0) {
    throw new Error("A product needs a name and at least one valid pack.");
  }
  const category = CATEGORIES.includes(input.category as CategoryId)
    ? (input.category as CategoryId)
    : existing?.category ?? "freeze-dried-fruits";
  const type = TYPES.includes(input.type as ProductType)
    ? (input.type as ProductType)
    : existing?.type ?? "Fruits";
  const benefits = Array.isArray(input.benefits)
    ? input.benefits.filter((benefit): benefit is Benefit => BENEFITS.includes(benefit))
    : existing?.benefits ?? [];

  return {
    id: existing?.id ?? `p_${Date.now().toString(36)}`,
    slug: text(input.slug, existing?.slug) || slugify(name),
    name,
    category,
    type,
    benefits: benefits.slice(0, 5),
    short: text(input.short, existing?.short),
    description: text(input.description, existing?.description),
    ingredients: text(input.ingredients, existing?.ingredients),
    nutrition: Array.isArray(input.nutrition)
      ? input.nutrition
          .map((row) => ({ label: text((row as { label?: string }).label), value: text((row as { value?: string }).value) }))
          .filter((row) => row.label && row.value)
      : existing?.nutrition ?? [],
    storage: text(input.storage, existing?.storage),
    usage: Array.isArray(input.usage)
      ? input.usage.map((item) => text(item)).filter(Boolean)
      : existing?.usage ?? [],
    packs,
    stock: Math.round(number(input.stock, existing?.stock ?? 0)),
    featured: Boolean(input.featured ?? existing?.featured),
    badge: text(input.badge, existing?.badge) || undefined,
    accent: ACCENTS.includes(input.accent as Accent)
      ? (input.accent as Accent)
      : existing?.accent ?? "forest",
    theme: THEMES.includes(input.theme as ProductTheme)
      ? (input.theme as ProductTheme)
      : existing?.theme ?? "gift",
    image: text(input.image, existing?.image) || undefined,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<Product>;
    const products = await getProducts();
    const product = cleanProduct(body);
    if (products.some((item) => item.slug === product.slug)) {
      product.slug = `${product.slug}-${Date.now().toString(36).slice(-3)}`;
    }
    await saveProducts([product, ...products]);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create product." },
      { status: 400 },
    );
  }
}
