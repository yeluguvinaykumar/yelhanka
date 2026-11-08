import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getSettings, saveSettings } from "@/lib/store";
import type { PaymentSettings, SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

function sanitize(value: unknown) {
  return String(value ?? "").trim().slice(0, 200);
}

/** Full settings including secrets — admin only. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ settings: await getSettings() });
}

/** Save payment methods and Razorpay credentials from the studio. */
export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { payments?: Partial<PaymentSettings> };
    const current = await getSettings();
    const incoming = body.payments ?? {};

    const payments: PaymentSettings = {
      razorpayEnabled: Boolean(incoming.razorpayEnabled),
      codEnabled: incoming.codEnabled === undefined ? current.payments.codEnabled : Boolean(incoming.codEnabled),
      whatsappEnabled:
        incoming.whatsappEnabled === undefined
          ? current.payments.whatsappEnabled
          : Boolean(incoming.whatsappEnabled),
      // Unchanged fields keep their stored value (the form submits blanks
      // when the admin did not retype a secret).
      razorpayKeyId: incoming.razorpayKeyId
        ? sanitize(incoming.razorpayKeyId)
        : current.payments.razorpayKeyId,
      razorpayKeySecret: incoming.razorpayKeySecret
        ? sanitize(incoming.razorpayKeySecret)
        : current.payments.razorpayKeySecret,
      razorpayWebhookSecret: incoming.razorpayWebhookSecret
        ? sanitize(incoming.razorpayWebhookSecret)
        : current.payments.razorpayWebhookSecret,
    };

    if (payments.razorpayEnabled && (!payments.razorpayKeyId || !payments.razorpayKeySecret)) {
      return NextResponse.json(
        {
          error:
            "Enter both the Razorpay Key ID and Key Secret before enabling online payments — or set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in the environment.",
        },
        { status: 400 },
      );
    }

    const settings: SiteSettings = { ...current, payments };
    await saveSettings(settings);
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
