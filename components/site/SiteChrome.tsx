"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SiteContent } from "@/lib/types";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Preloader } from "@/components/site/Preloader";
import { PageTransition } from "@/components/site/PageTransition";

/**
 * Renders the public storefront chrome. The admin studio intentionally gets a
 * clean canvas without the announcement bar, storefront navigation or footer.
 */
export function SiteChrome({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[140] -translate-y-24 rounded-full bg-forest px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-ivory transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <AnnouncementBar messages={content.announcements} />
      <Header />
      <main id="main-content" className="relative flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer content={content} />
      <CartDrawer />
      <FloatingActions />
      <CustomCursor />
      <Preloader />
    </>
  );
}
