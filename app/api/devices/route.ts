import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET ALL DEVICES
export async function GET() {
  const devices = await prisma.device.findMany({
    include: {
      brand: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(devices);
}

// ✅ CREATE DEVICE
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Creating device:", data);

    // ✅ Generate slug
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");

    const device = await prisma.device.create({
      data: {
        name: data.name,
        slug: slug,
        brandId: Number(data.brandId),
      },
    });

    return NextResponse.json(device);
  } catch (error) {
    console.error("Create device error:", error);

    return NextResponse.json(
      { error: "Failed to create device" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE DEVICE
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    console.log("Updating device:", data);

    // 🔥 Ensure ID is valid
    const id = Array.isArray(data.id) ? data.id[0] : data.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing device ID" },
        { status: 400 }
      );
    }

    // ✅ Generate slug on update
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");

    const updated = await prisma.device.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        slug: slug,
        brandId: Number(data.brandId),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update device error:", error);

    return NextResponse.json(
      { error: "Failed to update device" },
      { status: 500 }
    );
  }
}

// ✅ DELETE DEVICE
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.device.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete device error:", error);

    return NextResponse.json(
      { error: "Failed to delete device" },
      { status: 500 }
    );
  }
}