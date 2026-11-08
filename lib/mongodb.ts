import "server-only";

import { setServers } from "dns";
import { Db, MongoClient } from "mongodb";

/**
 * MongoDB connection helper.
 *
 * When MONGODB_URI is set (Vercel + Atlas) the app reads and writes through
 * MongoDB. When it is not set, lib/store.ts falls back to local JSON files so
 * local development works with zero configuration.
 *
 * MONGODB_DNS_SERVERS is optional and only needed on networks where the
 * system resolver cannot answer MongoDB Atlas SRV lookups. Provide a
 * comma-separated list such as `8.8.8.8,1.1.1.1`.
 */

const dnsServers = (process.env.MONGODB_DNS_SERVERS ?? "")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  setServers(dnsServers);
}

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var __tastyMongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __tastyMongoRetryAt: number | undefined;
}

const RETRY_AFTER_MS = 60_000;

export function isMongoConfigured() {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db | null> {
  if (!uri) return null;

  // If a recent attempt failed, skip MongoDB for a short while instead of
  // paying the full connection timeout on every request. The app serves local
  // JSON data during that window and retries automatically afterwards.
  if (global.__tastyMongoRetryAt && Date.now() < global.__tastyMongoRetryAt) {
    return null;
  }

  if (!global.__tastyMongoClient) {
    global.__tastyMongoClient = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    await global.__tastyMongoClient.connect();
    global.__tastyMongoRetryAt = undefined;
    return global.__tastyMongoClient.db(process.env.MONGODB_DB || "tasty-treasures");
  } catch (error) {
    // Network or DNS failures should degrade to the local JSON store rather than
    // taking the whole storefront down.
    console.error("MongoDB connection failed, falling back to local store:", error);
    global.__tastyMongoRetryAt = Date.now() + RETRY_AFTER_MS;
    try {
      await global.__tastyMongoClient.close();
    } catch {
      // Ignore close errors.
    }
    global.__tastyMongoClient = undefined;
    return null;
  }
}
