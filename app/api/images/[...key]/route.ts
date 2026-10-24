import { NextResponse } from "next/server";

import { readImage } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    const keyParts = (await context.params).key;
    if (!keyParts?.length || keyParts.some((part) => !part || part === "..")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    const object = await readImage(keyParts.join("/"));
    if (!object.Body) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const body = Buffer.from(await object.Body.transformToByteArray());
    return new Response(body, {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(object.ETag ? { ETag: object.ETag } : {}),
      },
    });
  } catch (error) {
    console.error("R2 IMAGE READ ERROR:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
