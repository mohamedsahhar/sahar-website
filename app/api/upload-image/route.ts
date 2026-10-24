import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/require-admin-session";
import { uploadImage } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

function safeSlug(value: FormDataEntryValue | null) {
  return String(value || "image")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "image";
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) return auth.response;

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select an image" }, { status: 400 });
    }

    const extension = EXTENSIONS[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, HEIC, or HEIF image" },
        { status: 415 }
      );
    }
    if (file.size < 1 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image size must be between 1 byte and 10 MB" },
        { status: 413 }
      );
    }

    const slug = safeSlug(formData.get("slug"));
    const key = `website/${slug}/${randomUUID()}.${extension}`;
    await uploadImage(key, file);

    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    return NextResponse.json({ url: `/api/images/${encodedKey}` });
  } catch (error) {
    console.error("R2 IMAGE UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
