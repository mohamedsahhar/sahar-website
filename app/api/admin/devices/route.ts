import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET (UNCHANGED)
export async function GET() {

  const devices = await prisma.device.findMany({
    include: { brand: true },
    orderBy: { id: "desc" }
  });

  return NextResponse.json(devices);
}


// ✅ CREATE DEVICE (PROTECTED)
export async function POST(req: Request) {
  const body = await req.json();
  const { name, brandId } = body;

  if (!name || !brandId) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  // 🔒 Prevent duplicate (case-insensitive + same brand)
  const existing = await prisma.device.findFirst({
    where: {
      brandId: Number(brandId),
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Device already exists for this brand" },
      { status: 400 }
    );
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const device = await prisma.device.create({
    data: {
      name,
      slug,
      brandId: Number(brandId),
    },
  });

  return NextResponse.json(device);
}


// ❌ DELETE DEVICE (BLOCKED IF HAS REPAIRS)
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing device id" },
      { status: 400 }
    );
  }

  // 🔒 Check if device has repairs
  const repairsCount = await prisma.repairCase.count({
    where: { deviceId: Number(id) },
  });

  if (repairsCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete device with existing repairs" },
      { status: 400 }
    );
  }

  await prisma.device.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}