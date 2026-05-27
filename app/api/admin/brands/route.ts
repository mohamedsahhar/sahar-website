import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET ALL BRANDS
export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(brands);
}

// ✅ CREATE BRAND (WITH SLUG + DUPLICATE PROTECTION)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Creating brand:", body);

    if (!body.name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // 🔒 Prevent duplicate (case-insensitive)
    const existing = await prisma.brand.findFirst({
      where: {
        name: {
          equals: body.name,
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

    // ✅ Generate slug
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const brand = await prisma.brand.create({
      data: {
        name: body.name,
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

// ✅ UPDATE BRAND (WITH SLUG + DUPLICATE PROTECTION)
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    console.log("Updating brand:", data);

    const id = Array.isArray(data.id) ? data.id[0] : data.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing brand ID" },
        { status: 400 }
      );
    }

    if (!data.name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // 🔒 Prevent duplicate on update
    const existing = await prisma.brand.findFirst({
      where: {
        name: {
          equals: data.name,
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

    // ✅ Generate slug
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const updated = await prisma.brand.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        slug,
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