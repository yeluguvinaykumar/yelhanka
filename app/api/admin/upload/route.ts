import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/admin";
import { isAllowedImageType, isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

// Vercel serverless functions cap request bodies at 4.5 MB, so keep files
// comfortably below that limit before the platform rejects the request.
const MAX_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (!isAllowedImageType(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, WebP or AVIF image." },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Images must be under 4 MB." }, { status: 400 });
    }

    // Optional sub-folder lets the studio keep products, content and gifts tidy.
    const requestedFolder = data.get("folder");
    const folder =
      typeof requestedFolder === "string" &&
      /^[a-z0-9][a-z0-9/_-]{0,40}$/i.test(requestedFolder)
        ? `tasty-treasures/${requestedFolder.replace(/^\/+|\/+$/g, "")}`
        : "tasty-treasures";

    // The studio picks the destination: "cloudinary", "local", or "auto"
    // (cloud when keys exist, otherwise the local disk).
    const requestedProvider = data.get("provider");
    const destination =
      requestedProvider === "cloudinary" || requestedProvider === "local"
        ? requestedProvider
        : "auto";
    const wantsCloud =
      destination === "cloudinary" || (destination === "auto" && isCloudinaryConfigured());

    // Cloudinary in production — images survive Vercel's read-only filesystem.
    if (wantsCloud && isCloudinaryConfigured()) {
      try {
        const url = await uploadToCloudinary(file, folder);
        return NextResponse.json({ url, provider: "cloudinary" });
      } catch (error) {
        // An explicit cloud choice surfaces the failure; "auto" falls through
        // to the local disk so the upload never fails for a config hiccup.
        if (destination === "cloudinary") {
          return NextResponse.json(
            { error: error instanceof Error ? error.message : "Cloudinary upload failed." },
            { status: 502 },
          );
        }
      }
    } else if (destination === "cloudinary") {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Switch to a local upload, or add the CLOUDINARY_* keys.",
        },
        { status: 503 },
      );
    }

    // Local disk — always available in development. Note: files written here
    // do not persist on Vercel's read-only filesystem, so prefer Cloud there.
    const extension = (file.name.split(".").pop() ?? "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const directory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(directory, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(directory, safeName), buffer);

    return NextResponse.json({ url: `/uploads/${safeName}`, provider: "local" });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
