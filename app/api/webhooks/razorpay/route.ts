import { NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/store";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

type RazorpayEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        order_id?: string;
        id?: string;
        error_code?: string;
        error_description?: string;
      };
    };
  };
};

/**
 * Razorpay webhook — the safety net for payments whose browser verification
 * never reached us (closed tab, dropped connection). Protected by the
 * webhook secret signature, never by cookies.
 *
 * Configure in Razorpay → Settings → Webhooks:
 *   URL:     https://<your-domain>/api/webhooks/razorpay
 *   Events:  payment.captured, payment.failed
 *   Secret:  the same value as RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!(await verifyRazorpayWebhook(rawBody, signature))) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: "Malformed body." }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  if (!razorpayOrderId) return NextResponse.json({ ok: true });

  try {
    const orders = await getOrders();
    const order: Order | undefined = orders.find(
      (item) => item.razorpay?.orderId === razorpayOrderId,
    );
    if (!order) return NextResponse.json({ ok: true });

    let updated: Order | null = null;

    if (event.event === "payment.captured" || event.event === "payment.authorized") {
      if (order.paymentStatus !== "paid") {
        updated = {
          ...order,
          paymentStatus: "paid",
          status: order.status === "new" ? "confirmed" : order.status,
          razorpay: {
            ...order.razorpay!,
            paymentId: payment.id ?? order.razorpay?.paymentId,
            paidAt: new Date().toISOString(),
          },
        };
      }
    } else if (event.event === "payment.failed") {
      if (order.paymentStatus === "pending") {
        updated = { ...order, paymentStatus: "failed" };
      }
    }

    if (updated) {
      await saveOrders(orders.map((item) => (item.id === order.id ? updated! : item)));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}
