import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import {
  isDelhiveryConfigured,
  mapTrackingToOrderStatus,
  trackDelhiveryShipment,
} from "@/lib/delhivery";
import { getOrders, patchOrder } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_ORDERS = 25;

/**
 * Vercel Cron entry point. Refreshes every open Delhivery waybill so order
 * statuses advance without an admin opening the studio. Protect it with
 * CRON_SECRET; without that variable only a signed-in admin may call it.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (secret) {
    if (authorization !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDelhiveryConfigured()) {
    return NextResponse.json({ skipped: true, reason: "Delhivery is not configured." });
  }

  const orders = await getOrders();
  const open = orders
    .filter(
      (order) =>
        order.shipment?.awb &&
        order.status !== "delivered" &&
        order.status !== "cancelled",
    )
    .slice(0, MAX_ORDERS);

  let updated = 0;
  const failures: { order: string; error: string }[] = [];

  for (const order of open) {
    try {
      const tracking = await trackDelhiveryShipment(order.shipment!.awb);
      const mapped = mapTrackingToOrderStatus(tracking.status);
      const now = new Date().toISOString();
      const result = await patchOrder(order.id, {
        status: mapped ?? order.status,
        shipment: {
          ...order.shipment!,
          status: tracking.status,
          location: tracking.location,
          updatedAt: tracking.updatedAt || now,
          scans: tracking.scans,
        },
      });
      if (result) updated += 1;
    } catch (error) {
      failures.push({
        order: order.id,
        error: error instanceof Error ? error.message : "Tracking failed.",
      });
    }
  }

  return NextResponse.json({
    checked: open.length,
    updated,
    failures,
    syncedAt: new Date().toISOString(),
  });
}
