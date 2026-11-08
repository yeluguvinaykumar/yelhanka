import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { getSettings } from "./store";

/**
 * Razorpay payment gateway client (no SDK — plain REST + crypto).
 *
 *  - Create an order:  POST https://api.razorpay.com/v1/orders  (Basic auth)
 *  - Checkout:         window.Razorpay from checkout.razorpay.com
 *  - Verify payment:   HMAC-SHA256(order_id|payment_id) with the key secret
 *  - Verify webhook:   HMAC-SHA256(raw body) with the webhook secret
 *
 * Credentials are read from the studio's Payment settings first and fall back
 * to the RAZORPAY_* environment variables, so everything can be managed from
 * the admin panel.
 */

const ORDERS_API = "https://api.razorpay.com/v1/orders";

export type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
};

export class RazorpayError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "RazorpayError";
    this.status = status;
  }
}

/** Admin settings win; env vars are the headless fallback. */
export async function getRazorpayCredentials(): Promise<RazorpayCredentials> {
  let fromSettings: Partial<RazorpayCredentials> = {};
  try {
    const settings = await getSettings();
    fromSettings = {
      keyId: settings.payments?.razorpayKeyId?.trim(),
      keySecret: settings.payments?.razorpayKeySecret?.trim(),
      webhookSecret: settings.payments?.razorpayWebhookSecret?.trim(),
    };
  } catch {
    // Settings unreadable — the env fallback below still applies.
  }
  return {
    keyId: fromSettings.keyId || process.env.RAZORPAY_KEY_ID || "",
    keySecret: fromSettings.keySecret || process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: fromSettings.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || "",
  };
}

export async function isRazorpayConfigured(): Promise<boolean> {
  const { keyId, keySecret } = await getRazorpayCredentials();
  return Boolean(keyId && keySecret);
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

/** Amount is in rupees; Razorpay expects paise. */
export async function createRazorpayOrder(input: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const { keyId, keySecret } = await getRazorpayCredentials();
  if (!keyId || !keySecret) {
    throw new RazorpayError(
      "Online payments are not configured yet. Add your Razorpay keys in Admin → Integrations.",
      503,
    );
  }

  const amountPaise = Math.max(100, Math.round(input.amount * 100));
  const response = await fetch(ORDERS_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes ?? {},
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as {
    id?: string;
    amount?: number;
    currency?: string;
    error?: string;
    error_description?: string;
  } | null;

  if (!response.ok || !data?.id) {
    throw new RazorpayError(
      data?.error_description ||
        data?.error ||
        "Razorpay could not create the payment order. Please try again.",
      response.status >= 500 ? 502 : response.status,
    );
  }

  return {
    id: data.id,
    amount: data.amount ?? amountPaise,
    currency: data.currency ?? "INR",
  };
}

function safeEqual(expected: string, actual: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** HMAC-SHA256(`${order_id}|${payment_id}`) signed with the key secret. */
export async function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<boolean> {
  const { keySecret } = await getRazorpayCredentials();
  if (!keySecret || !input.orderId || !input.paymentId || !input.signature) return false;
  const expected = createHmac("sha256", keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return safeEqual(expected, input.signature);
}

/** HMAC-SHA256 of the raw request body, signed with the webhook secret. */
export async function verifyRazorpayWebhook(
  rawBody: string,
  signature: string,
): Promise<boolean> {
  const { webhookSecret } = await getRazorpayCredentials();
  if (!webhookSecret || !signature) return false;
  const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
