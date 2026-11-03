import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { Document, ObjectId } from "mongodb";
import { getMongoDb, isMongoConfigured } from "./mongodb";
import { seedProducts } from "./catalogue";
import { defaultContent } from "./content";
import type {
  Enquiry,
  Order,
  Product,
  SiteContent,
  Subscriber,
} from "./types";

/**
 * Storage layer.
 *
 * On Vercel (MONGODB_URI set) every read/write goes to MongoDB so data
 * survives serverless restarts. Without MONGODB_URI the store falls back to
 * local JSON files under /data for zero-config local development. Both paths
 * expose the same functions, so API routes do not care which backend is
 * active.
 */

const dataDir = path.join(process.cwd(), "data");

/* ------------------------------- JSON files ------------------------------ */

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(dataDir, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  await ensureDir();
  const target = path.join(dataDir, file);
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(temp, target);
}

/* -------------------------------- MongoDB ------------------------------- */

async function mongoAll<T>(collection: string): Promise<T[] | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  if (!db) return null;
  const docs = await db
    .collection(collection)
    .find({}, { projection: { _id: 0, idx: 0 } })
    .sort({ idx: 1 })
    .toArray();
  return docs as unknown as T[];
}

/**
 * Persist a whole collection without dropping documents first. Each item is
 * keyed by its own `id`, so concurrent reads never observe an empty collection
 * and a failed write cannot wipe live data. Stale documents are removed after
 * the upserts succeed.
 */
async function mongoReplace<T>(
  collection: string,
  items: T[],
  idField = "id",
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getMongoDb();
  if (!db) return false;
  const col = db.collection<Document>(collection);

  const docs = items.map((item, index) => {
    const record = item as unknown as Record<string, unknown>;
    const id = record[idField];
    return {
      ...(item as unknown as Document),
      _id: (typeof id === "string" && id ? id : `idx_${index}`) as Document["_id"],
      idx: index,
    };
  });

  if (docs.length > 0) {
    await col.bulkWrite(
      docs.map((doc) => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      })),
    );
  }

  await col.deleteMany({ _id: { $nin: docs.map((doc) => doc._id) } });
  return true;
}

/* ----------------------------- Orders (single) --------------------------- */

type StringIdDocument = Document & { _id: string };

/** Insert one order without rewriting the whole collection. */
export async function addOrder(order: Order): Promise<void> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db.collection<Document>("orders").insertOne({
        ...(order as unknown as Document),
        _id: order.id as Document["_id"],
        idx: -Date.now(),
      });
      return;
    }
  }

  const orders = await readJson<Order[]>("orders.json", []);
  await writeJson("orders.json", [
    order,
    ...orders.filter((item) => item.id !== order.id),
  ]);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection<StringIdDocument>("orders").findOne(
        { _id: id },
        { projection: { _id: 0, idx: 0 } },
      );
      return (doc as unknown as Order) ?? undefined;
    }
  }
  const orders = await readJson<Order[]>("orders.json", []);
  return orders.find((order) => order.id === id);
}

/**
 * Patch only the supplied order fields. Used by the courier routes so two
 * admins updating stock/tracking at the same time cannot overwrite each other.
 */
export async function patchOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | undefined> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      const result = await db.collection<StringIdDocument>("orders").findOneAndUpdate(
        { _id: id },
        { $set: patch as unknown as Document },
        {
          returnDocument: "after",
          projection: { _id: 0, idx: 0 },
        },
      );
      if (!result) return undefined;
      return result as unknown as Order;
    }
  }

  const orders = await readJson<Order[]>("orders.json", []);
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) return undefined;
  orders[index] = { ...orders[index], ...patch };
  await writeJson("orders.json", orders);
  return orders[index];
}

/* -------------------------------- Products ------------------------------ */

export async function getProducts(): Promise<Product[]> {
  const stored = await mongoAll<Product>("products");
  if (stored) return stored.length > 0 ? stored : seedProducts;
  const products = await readJson<Product[]>("products.json", []);
  return products.length === 0 ? seedProducts : products;
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (await mongoReplace("products", products)) return;
  await writeJson("products.json", products);
}

export async function getProduct(idOrSlug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(
    (product) => product.id === idOrSlug || product.slug === idOrSlug,
  );
}

/* -------------------------------- Content ------------------------------- */

async function loadStoredContent(): Promise<Partial<SiteContent> | null> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (!db) return null;
    const doc = await db.collection<StringIdDocument>("content").findOne({ _id: "site" });
    if (!doc) return null;
    const { _id, idx, ...rest } = doc;
    return rest as Partial<SiteContent>;
  }
  const stored = await readJson<Partial<SiteContent>>("content.json", {});
  return stored.site ? stored : null;
}

export async function getContent(): Promise<SiteContent> {
  const stored = await loadStoredContent();
  if (!stored?.site) return defaultContent;
  return {
    ...defaultContent,
    ...stored,
    site: { ...defaultContent.site, ...stored.site },
    hero: { ...defaultContent.hero, ...stored.hero },
    about: { ...defaultContent.about, ...stored.about },
    stats: stored.stats?.length ? stored.stats : defaultContent.stats,
    announcements: stored.announcements?.length
      ? stored.announcements
      : defaultContent.announcements,
  };
}

export async function saveContent(content: SiteContent): Promise<void> {
  if (isMongoConfigured()) {
    const db = await getMongoDb();
    if (db) {
      await db.collection<StringIdDocument>("content").replaceOne(
        { _id: "site" },
        { ...(content as unknown as Document), _id: "site" } as StringIdDocument,
        { upsert: true },
      );
      return;
    }
  }
  await writeJson("content.json", content);
}

/* --------------------------------- Orders ------------------------------- */

export async function getOrders(): Promise<Order[]> {
  const stored = await mongoAll<Order>("orders");
  if (stored) return stored;
  return readJson<Order[]>("orders.json", []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  if (await mongoReplace("orders", orders)) return;
  await writeJson("orders.json", orders);
}

/* ------------------------------- Enquiries ------------------------------ */

export async function getEnquiries(): Promise<Enquiry[]> {
  const stored = await mongoAll<Enquiry>("enquiries");
  if (stored) return stored;
  return readJson<Enquiry[]>("enquiries.json", []);
}

export async function saveEnquiries(enquiries: Enquiry[]): Promise<void> {
  if (await mongoReplace("enquiries", enquiries)) return;
  await writeJson("enquiries.json", enquiries);
}

/* ------------------------------ Subscribers ----------------------------- */

export async function getSubscribers(): Promise<Subscriber[]> {
  const stored = await mongoAll<Subscriber>("subscribers");
  if (stored) return stored;
  return readJson<Subscriber[]>("subscribers.json", []);
}

export async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  if (await mongoReplace("subscribers", subscribers)) return;
  await writeJson("subscribers.json", subscribers);
}
