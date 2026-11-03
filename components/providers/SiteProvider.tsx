"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/types";

const SiteContext = createContext<SiteContent["site"] | null>(null);

export function SiteProvider({
  settings,
  children,
}: {
  settings: SiteContent["site"];
  children: ReactNode;
}) {
  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used inside SiteProvider");
  }
  return context;
}
