import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import type { SiteContent, Stat } from "@/lib/types";

export async function GET() {
  const content = await getContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<SiteContent>;
    const current = await getContent();

    const stats: Stat[] = Array.isArray(body.stats)
      ? body.stats.slice(0, 6).map((stat) => ({
          value: Number(stat.value) || 0,
          prefix: stat.prefix?.toString().slice(0, 4) || undefined,
          suffix: stat.suffix?.toString().slice(0, 4) || undefined,
          label: stat.label?.toString().slice(0, 60) || "Statistic",
          detail: stat.detail?.toString().slice(0, 200) || "",
        }))
      : current.stats;

    const announcements = Array.isArray(body.announcements)
      ? body.announcements.map((item) => item.toString().trim()).filter(Boolean).slice(0, 6)
      : current.announcements;

    const content: SiteContent = {
      site: { ...current.site, ...(body.site ?? {}) },
      hero: { ...current.hero, ...(body.hero ?? {}) },
      about: { ...current.about, ...(body.about ?? {}) },
      stats,
      announcements: announcements.length ? announcements : current.announcements,
    };

    content.site.freeShippingThreshold = Math.max(
      0,
      Number(content.site.freeShippingThreshold) || 0,
    );
    content.site.shippingFee = Math.max(0, Number(content.site.shippingFee) || 0);
    content.site.whatsapp = content.site.whatsapp.replace(/\D/g, "");

    await saveContent(content);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Could not save content." }, { status: 400 });
  }
}
