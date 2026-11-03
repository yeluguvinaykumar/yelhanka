import { NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/store";
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
    const body = (await request.json()) as { status?: OrderStatus };
    if (!body.status || !STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }
    const orders = await getOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index < 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    orders[index] = { ...orders[index], status: body.status };
    await saveOrders(orders);
    return NextResponse.json({ order: orders[index] });
  } catch {
    return NextResponse.json({ error: "Could not update order." }, { status: 400 });
  }
}
