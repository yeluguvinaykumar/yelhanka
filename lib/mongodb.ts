import "server-only";

import { Db, MongoClient } from "mongodb";

/**
 * MongoDB connection helper.
 *
 * When MONGODB_URI is set (Vercel + Atlas) the app reads and writes through
 * MongoDB. When it is not set, lib/store.ts falls back to local JSON files so
 * local development works with zero configuration.
 */

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var __tastyMongoClient: MongoClient | undefined;
}

export function isMongoConfigured() {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db | null> {
  if (!uri) return null;

  if (!global.__tastyMongoClient) {
    global.__tastyMongoClient = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  }

  await global.__tastyMongoClient.connect();
  return global.__tastyMongoClient.db(process.env.MONGODB_DB || "tasty-treasures");
}
