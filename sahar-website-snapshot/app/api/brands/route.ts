import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET ALL BRANDS
export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(brands);
}

// ✅ CREATE BRAND
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Creating brand:", data);

    const brand = await prisma.brand.create({
      data: {
        name: data.name, // ✅ removed slug
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

// ✅ UPDATE BRAND
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

    const updated = await prisma.brand.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
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

// ✅ DELETE BRAND
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

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