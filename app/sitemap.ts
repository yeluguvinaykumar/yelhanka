import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/store";
import { policySlugs } from "@/lib/policies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tastytreasures.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/cart`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/checkout`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/shop/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "monthly",
    priority: product.featured ? 0.8 : 0.7,
  }));

  const policyRoutes: MetadataRoute.Sitemap = policySlugs.map((slug) => ({
    url: `${siteUrl}/policies/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...productRoutes, ...policyRoutes];
}
