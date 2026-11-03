import "server-only";

import type { Order, OrderStatus, ShipmentScan } from "./types";

/**
 * Delhivery courier integration.
 *
 * Docs: https://delhivery-express-api-doc.readme.io
 *  - Order creation (manifestation): POST /api/cmu/create.json
 *  - Tracking (pull API):            GET  /api/v1/packages/json/
 *
 * Set DELHIVERY_ENV=staging to use Delhivery's test environment.
 */

const PRODUCTION_BASE = "https://track.delhivery.com";
const STAGING_BASE = "https://staging-express.delhivery.com";

function apiBase() {
  return process.env.DELHIVERY_ENV === "staging" ? STAGING_BASE : PRODUCTION_BASE;
}

function token() {
  return process.env.DELHIVERY_API_TOKEN || "";
}

export function isDelhiveryConfigured() {
  return Boolean(process.env.DELHIVERY_API_TOKEN && process.env.DELHIVERY_CLIENT);
}

export type PickupLocation = {
  name: string;
  add: string;
  city: string;
  pin: string;
  country: string;
  phone: string;
};

/**
 * The pickup name must match the warehouse name registered with Delhivery
 * exactly (case sensitive), otherwise order creation is rejected.
 */
export function getPickupLocation(): PickupLocation {
  return {
    name: process.env.DELHIVERY_PICKUP_NAME || "",
    add: process.env.DELHIVERY_PICKUP_ADDRESS || "",
    city: process.env.DELHIVERY_PICKUP_CITY || "",
    pin: process.env.DELHIVERY_PICKUP_PINCODE || "",
    country: process.env.DELHIVERY_PICKUP_COUNTRY || "India",
    phone: process.env.DELHIVERY_PICKUP_PHONE || "",
  };
}

export function pickupIsConfigured() {
  const pickup = getPickupLocation();
  return Boolean(pickup.name && pickup.add && pickup.city && pickup.pin && pickup.phone);
}

export class DelhiveryError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "DelhiveryError";
    this.status = status;
  }
}

function orderDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function clean(value: string) {
  // Delhivery rejects a few raw characters; JSON encoding handles most of it,
  // but trimming keeps payloads tidy and within their character rules.
  return value.replace(/[&;\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

export type CreateShipmentResult = {
  awb: string;
  ref?: string;
};

/**
 * Manifest an order with Delhivery and receive its waybill (AWB).
 */
export async function createDelhiveryShipment(
  order: Order,
): Promise<CreateShipmentResult> {
  if (!isDelhiveryConfigured()) {
    throw new DelhiveryError(
      "Delhivery is not configured. Set DELHIVERY_API_TOKEN and DELHIVERY_CLIENT.",
      503,
    );
  }
  const pickup = getPickupLocation();
  if (!pickupIsConfigured()) {
    throw new DelhiveryError(
      "Delhivery pickup details are incomplete. Set DELHIVERY_PICKUP_NAME, _ADDRESS, _CITY, _PINCODE and _PHONE.",
      503,
    );
  }

  const pieces = order.items.reduce((total, item) => total + item.qty, 0);
  const grams = order.items.reduce((total, item) => total + item.grams * item.qty, 0);
  const description = order.items
    .map((item) => `${item.name} (${item.packLabel} x${item.qty})`)
    .join(", ");

  const payload = {
    pickup_location: {
      name: pickup.name,
      add: clean(pickup.add),
      city: clean(pickup.city),
      pin: pickup.pin,
      country: pickup.country,
      phone: pickup.phone,
    },
    shipments: [
      {
        order: order.id,
        order_date: orderDateTime(order.createdAt),
        payment_mode: order.payment === "cod" ? "COD" : "Prepaid",
        cod_amount: order.payment === "cod" ? order.total : 0,
        total_amount: order.total,
        name: clean(order.customer.name),
        add: clean(order.customer.address),
        city: clean(order.customer.city),
        state: clean(order.customer.state),
        pin: order.customer.pincode,
        country: "India",
        phone: order.customer.phone.replace(/\D/g, "").slice(0, 15),
        quantity: String(pieces),
        products_desc: clean(description),
        weight: String(Math.max(grams, 100)),
        shipping_mode: process.env.DELHIVERY_SHIPPING_MODE === "Express" ? "Express" : "Surface",
      },
    ],
  };

  // Delhivery's package-creation endpoint expects `format=json&data=<payload>`
  // form encoding. Sending a bare JSON body is rejected by most accounts.
  const form = new URLSearchParams();
  form.set("format", "json");
  form.set("data", JSON.stringify(payload));

  let response: Response;
  try {
    response = await fetch(`${apiBase()}/api/cmu/create.json`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
    });
  } catch {
    throw new DelhiveryError("Could not reach Delhivery. Please try again.");
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: boolean;
    rmk?: string;
    packages?: {
      status?: string;
      waybill?: string;
      refnum?: string;
      remarks?: string;
    }[];
  } | null;

  if (!response.ok || !data) {
    throw new DelhiveryError(`Delhivery rejected the request (${response.status}).`);
  }

  const shipment = data.packages?.[0];
  const awb = shipment?.waybill;

  if (data.error || shipment?.status === "Fail" || !awb) {
    const reason =
      shipment?.remarks ||
      data.rmk ||
      "Delhivery could not create the shipment. Check the pickup details.";
    throw new DelhiveryError(reason);
  }

  return { awb: String(awb), ref: shipment?.refnum };
}

export type TrackingResult = {
  status: string;
  statusType?: string;
  location?: string;
  updatedAt?: string;
  scans: ShipmentScan[];
};

/**
 * Fetch the live scan history for a waybill.
 */
export async function trackDelhiveryShipment(awb: string): Promise<TrackingResult> {
  if (!isDelhiveryConfigured()) {
    throw new DelhiveryError("Delhivery is not configured.", 503);
  }

  const url = `${apiBase()}/api/v1/packages/json/?token=${encodeURIComponent(
    token(),
  )}&waybill=${encodeURIComponent(awb)}`;

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new DelhiveryError("Could not reach Delhivery. Please try again.");
  }

  if (response.status === 401) {
    throw new DelhiveryError("Delhivery rejected the API token.", 502);
  }

  type TrackedShipment = {
    Status?: {
      Status?: string;
      StatusType?: string;
      StatusLocation?: string;
      StatusDateTime?: string;
    };
    Scans?: {
      ScanDetail?: {
        ScanDateTime?: string;
        StatusDateTime?: string;
        ScanType?: string;
        Scan?: string;
        ScannedLocation?: string;
        Instructions?: string;
      };
    }[];
  };

  type ShipmentEnvelope = { Shipment?: TrackedShipment };

  const data = (await response.json().catch(() => null)) as {
    Error?: string;
    ShipmentData?: ShipmentEnvelope[] | ShipmentEnvelope;
  } | null;

  if (!response.ok || !data) {
    throw new DelhiveryError(`Delhivery tracking failed (${response.status}).`);
  }
  if (data.Error) {
    throw new DelhiveryError(data.Error, 404);
  }

  const shipment = Array.isArray(data.ShipmentData)
    ? data.ShipmentData[0]?.Shipment
    : data.ShipmentData?.Shipment;
  if (!shipment) {
    throw new DelhiveryError("No tracking data found for this waybill yet.", 404);
  }

  const scans: ShipmentScan[] = (shipment.Scans ?? [])
    .map((entry) => entry.ScanDetail)
    .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
    .map((detail) => ({
      at: detail.StatusDateTime || detail.ScanDateTime || "",
      status: detail.ScanType || detail.Scan || undefined,
      location: detail.ScannedLocation || undefined,
      detail: detail.Instructions ? detail.Instructions.split("|")[0]?.trim() : undefined,
    }))
    .filter((scan) => scan.at || scan.status)
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
    .slice(0, 30);

  return {
    status:
      shipment.Status?.Status || shipment.Status?.StatusType || scans[0]?.status || "In transit",
    statusType: shipment.Status?.StatusType,
    location: shipment.Status?.StatusLocation,
    updatedAt: shipment.Status?.StatusDateTime || scans[0]?.at,
    scans,
  };
}

/**
 * Map a Delhivery scan status onto our order lifecycle. Returns null when the
 * courier status should not move the order (unknown or a regression).
 */
export function mapTrackingToOrderStatus(status: string): OrderStatus | null {
  const value = status.toLowerCase();
  if (value.includes("rto") && value.includes("delivered")) return "cancelled";
  if (value.includes("delivered")) return "delivered";
  if (value.includes("out for delivery") || value.includes("in transit") || value.includes("pickup")) {
    return "shipped";
  }
  return null;
}

/** Order statuses that are eligible to be handed to a courier. */
export const SHIPPABLE_STATUSES: OrderStatus[] = ["new", "confirmed", "packed"];

/** Public tracking page customers can open without an API token. */
export function delhiveryTrackingUrl(awb: string) {
  return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
}
