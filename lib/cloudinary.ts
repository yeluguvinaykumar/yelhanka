import "server-only";

import { createHash } from "crypto";

/**
 * Cloudinary unsigned-free, signed server-side uploads.
 *
 * The signature is an SHA-1 hash of `folder=...&timestamp=...` plus your API
 * secret, which keeps uploads locked to your own cloud without exposing
 * secrets in the browser. See https://cloudinary.com/documentation/upload_images
 */

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function isAllowedImageType(type: string) {
  return ALLOWED_TYPES.includes(type);
}

export async function uploadToCloudinary(
  file: File,
  folder = "tasty-treasures",
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", apiKey);
  form.set("timestamp", String(timestamp));
  form.set("folder", folder);
  form.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );

  const data = (await response.json().catch(() => null)) as {
    secure_url?: string;
    error?: { message?: string };
  } | null;

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary could not accept the image.");
  }

  return data.secure_url;
}
