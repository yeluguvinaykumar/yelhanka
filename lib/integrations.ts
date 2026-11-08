import "server-only";

import { isCloudinaryConfigured } from "./cloudinary";
import { isDelhiveryConfigured, pickupIsConfigured } from "./delhivery";
import { getMongoDb, isMongoConfigured } from "./mongodb";
import type { IntegrationStatus } from "./types";

/**
 * Read-only snapshot of the integration environment used by the admin
 * "Integrations" panel. Never returns secret values — only whether they are
 * present, whether MongoDB is actually reachable, and which mode is active.
 */
export async function getIntegrationStatus(): Promise<IntegrationStatus> {
  const mongodb = isMongoConfigured();
  const mongodbReachable = mongodb ? Boolean(await getMongoDb()) : false;
  return {
    storage: mongodbReachable ? "mongodb" : "local",
    mongodb,
    mongodbReachable,
    cloudinary: isCloudinaryConfigured(),
    delhivery: isDelhiveryConfigured(),
    delhiveryPickup: pickupIsConfigured(),
    delhiveryEnv:
      process.env.DELHIVERY_ENV === "staging" ? "staging" : "production",
    delhiveryShippingMode:
      process.env.DELHIVERY_SHIPPING_MODE === "Express" ? "Express" : "Surface",
    adminHardened: Boolean(
      process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET,
    ),
    vercel: Boolean(process.env.VERCEL),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
