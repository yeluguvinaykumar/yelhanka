import { NextResponse } from "next/server";
import { getOrder, patchOrder } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await request.json()) as {
      status?: OrderStatus;
      paymentStatus?: "paid" | "pending";
    };
    if (!body.status && !body.paymentStatus) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }
    if (body.status && !STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }
    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    const patch: Partial<typeof order> = {};
    if (body.status) patch.status = body.status;
    if (body.paymentStatus) {
      patch.paymentStatus = body.paymentStatus;
      // Manual override — a UPI transfer or card payment settled outside the
      // checkout. Keeps the audit trail honest without inventing a gateway id.
      if (body.paymentStatus === "paid" && order.razorpay) {
        patch.razorpay = { ...order.razorpay, paidAt: new Date().toISOString() };
      }
    }
    const updated = await patchOrder(id, patch);
    return NextResponse.json({ order: updated ?? { ...order, ...patch } });
  } catch {
    return NextResponse.json({ error: "Could not update order." }, { status: 400 });
  }
}
