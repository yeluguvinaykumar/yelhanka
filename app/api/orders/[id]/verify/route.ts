import { NextResponse } from "next/server";
import { getOrder, patchOrder } from "@/lib/store";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Confirm a Razorpay checkout: the browser posts the handler response and we
 * re-derive the HMAC ourselves before marking the order paid. A forged
 * client can never claim a payment it did not make.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
      return NextResponse.json({ error: "Missing payment response." }, { status: 400 });
    }

    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.payment !== "razorpay" || order.razorpay?.orderId !== body.razorpay_order_id) {
      return NextResponse.json(
        { error: "This payment does not match the order." },
        { status: 409 },
      );
    }

    const valid = await verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!valid) {
      // Keep the order pending — the webhook or an admin can still settle it.
      await patchOrder(id, { paymentStatus: "failed" });
      return NextResponse.json(
        { error: "Payment could not be verified. If you were charged, we will confirm it manually." },
        { status: 400 },
      );
    }

    const updated = await patchOrder(id, {
      paymentStatus: "paid",
      payment: "razorpay",
      status: order.status === "new" ? "confirmed" : order.status,
      razorpay: {
        ...order.razorpay!,
        paymentId: body.razorpay_payment_id,
        signature: body.razorpay_signature,
        paidAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ order: updated ?? order });
  } catch {
    return NextResponse.json({ error: "Could not verify the payment." }, { status: 500 });
  }
}
