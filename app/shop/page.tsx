import type { Metadata } from "next";
import { getProducts } from "@/lib/store";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop the Pantry",
  description:
    "Explore freeze-dried fruits, dehydrated vegetable chips, single-ingredient superfood powders and considered gift combos.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return <ShopClient products={products} initialCategory={params.category} />;
}
