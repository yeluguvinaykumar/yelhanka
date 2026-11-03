import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import type { Product } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await request.json()) as Partial<Product>;
    const products = await getProducts();
    const index = products.findIndex((item) => item.id === id || item.slug === id);
    if (index < 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const current = products[index];
    const merged: Product = {
      ...current,
      ...body,
      id: current.id,
      createdAt: current.createdAt,
      packs: body.packs ?? current.packs,
      nutrition: body.nutrition ?? current.nutrition,
      usage: body.usage ?? current.usage,
      benefits: body.benefits ?? current.benefits,
      slug: body.slug?.trim() || current.slug,
      name: body.name?.trim() || current.name,
      stock: body.stock !== undefined ? Math.max(0, Math.round(Number(body.stock))) : current.stock,
      featured: body.featured ?? current.featured,
    };

    if (!merged.slug || !merged.name || merged.packs.length === 0) {
      return NextResponse.json({ error: "Name, slug and a pack are required." }, { status: 400 });
    }
    if (products.some((item, itemIndex) => itemIndex !== index && item.slug === merged.slug)) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }

    products[index] = merged;
    await saveProducts(products);
    return NextResponse.json({ product: merged });
  } catch {
    return NextResponse.json({ error: "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const products = await getProducts();
  const next = products.filter((item) => item.id !== id && item.slug !== id);
  if (next.length === products.length) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  await saveProducts(next);
  return NextResponse.json({ ok: true });
}
