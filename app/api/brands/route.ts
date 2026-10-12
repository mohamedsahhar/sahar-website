import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin-session";
import {
  createUniqueSlug,
  normalizeEntityName,
} from "@/lib/naming";

// ✅ GET ALL BRANDS
export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(brands);
}

// ✅ CREATE BRAND (WITH SLUG + DUPLICATE PROTECTION)
export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const data = await req.json();
    console.log("Creating brand:", data);

    const name = normalizeEntityName(data.name);

    if (!name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // 🔒 Prevent duplicate (case-insensitive)
    const existing = await prisma.brand.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Brand already exists" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(name, async (candidate) =>
      Boolean(await prisma.brand.findUnique({ where: { slug: candidate } }))
    );

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Create brand error:", error);

    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE BRAND (WITH SLUG + DUPLICATE CHECK)
export async function PUT(req: Request) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const data = await req.json();
    console.log("Updating brand:", data);

    const name = normalizeEntityName(data.name);

    const id = Array.isArray(data.id) ? data.id[0] : data.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing brand ID" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // 🔒 Prevent duplicate (excluding current)
    const existing = await prisma.brand.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Brand name already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.brand.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update brand error:", error);

    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// ❌ DELETE BRAND (BLOCK IF HAS DEVICES)
export async function DELETE(req: Request) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing brand ID" },
        { status: 400 }
      );
    }

    // 🔒 Prevent delete if devices exist
    const devicesCount = await prisma.device.count({
      where: {
        brandId: Number(id),
      },
    });

    if (devicesCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete brand with existing devices" },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete brand error:", error);

    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
