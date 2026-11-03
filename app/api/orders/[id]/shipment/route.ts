import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import {
  DelhiveryError,
  SHIPPABLE_STATUSES,
  createDelhiveryShipment,
  mapTrackingToOrderStatus,
  trackDelhiveryShipment,
} from "@/lib/delhivery";
import { getOrder, patchOrder } from "@/lib/store";
import type { Shipment } from "@/lib/types";

export const dynamic = "force-dynamic";

function failure(error: unknown, fallback: string) {
  const status = error instanceof DelhiveryError ? error.status : 502;
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}

/** Manifest an order with Delhivery and store the generated waybill (AWB). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.shipment?.awb) {
    return NextResponse.json(
      { error: `This order already has the Delhivery waybill ${order.shipment.awb}.` },
      { status: 409 },
    );
  }
  if (!SHIPPABLE_STATUSES.includes(order.status)) {
    return NextResponse.json(
      { error: `A ${order.status} order cannot be handed to the courier.` },
      { status: 400 },
    );
  }

  try {
    const created = await createDelhiveryShipment(order);
    const now = new Date().toISOString();
    const shipment: Shipment = {
      courier: "delhivery",
      awb: created.awb,
      reference: created.ref,
      status: "Manifested",
      createdAt: now,
      updatedAt: now,
      scans: [],
    };

    const updated = await patchOrder(order.id, {
      status: "shipped",
      shipment,
    });

    return NextResponse.json({ order: updated ?? { ...order, status: "shipped", shipment } });
  } catch (error) {
    return failure(error, "Delhivery could not create the shipment.");
  }
}

/** Pull the latest Delhivery scans and move the order through its lifecycle. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (!order.shipment?.awb) {
    return NextResponse.json(
      { error: "Create a Delhivery shipment before syncing tracking." },
      { status: 400 },
    );
  }

  try {
    const tracking = await trackDelhiveryShipment(order.shipment.awb);
    const mapped = mapTrackingToOrderStatus(tracking.status);
    const now = new Date().toISOString();
    const shipment: Shipment = {
      ...order.shipment,
      status: tracking.status,
      location: tracking.location,
      updatedAt: tracking.updatedAt || now,
      scans: tracking.scans,
    };

    const updated = await patchOrder(order.id, {
      status: mapped ?? order.status,
      shipment,
    });

    return NextResponse.json({
      order: updated ?? { ...order, shipment },
      tracking,
    });
  } catch (error) {
    return failure(error, "Delhivery tracking could not be refreshed.");
  }
}
