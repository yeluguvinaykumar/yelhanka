import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Allura } from "next/font/google";
import { getContent } from "@/lib/store";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { SiteChrome } from "@/components/site/SiteChrome";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
  weight: ["400"],
});

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tastytreasures.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tasty Treasures — Nature's Goodness, Beautifully Preserved",
    template: "%s · Tasty Treasures",
  },
  description:
    "Premium freeze-dried fruits, dehydrated vegetable chips and single-ingredient superfood powders. Real food, made slowly, packed by hand in India.",
  keywords: [
    "freeze-dried fruit",
    "dehydrated vegetable chips",
    "moringa powder",
    "superfood powders",
    "natural snacks India",
    "Tasty Treasures",
  ],
  openGraph: {
    title: "Tasty Treasures — Nature's Goodness, Beautifully Preserved",
    description:
      "Freeze-dried fruit, vegetable chips and single-ingredient powders. Real food, made slowly.",
    url: siteUrl,
    siteName: "Tasty Treasures",
    images: [{ url: "/images/hero-fruits.jpg", width: 1200, height: 1500, alt: "Tasty Treasures ingredients" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasty Treasures",
    description: "Nature's goodness, beautifully preserved.",
    images: ["/images/hero-fruits.jpg"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#103F25",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tasty Treasures",
    description: content.site.tagline,
    url: siteUrl,
    email: content.site.email,
    telephone: content.site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.site.address,
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${allura.variable}`}>
      <body className="grain font-sans antialiased">
        <SiteProvider settings={content.site}>
          <CartProvider>
            <SiteChrome content={content}>{children}</SiteChrome>
          </CartProvider>
        </SiteProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
        />
      </body>
    </html>
  );
}
