import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin-session";
import {
  createUniqueSlug,
  normalizeDeviceName,
  normalizeEntityName,
} from "@/lib/naming";

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
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const data = await req.json();
    console.log("Creating device:", data);

    const brandId = Number(data.brandId);
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { name: true, slug: true },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Select a valid brand" },
        { status: 400 }
      );
    }

    const name = normalizeDeviceName(data.name, brand.name);

    if (!name) {
      return NextResponse.json(
        { error: "Device name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.device.findFirst({
      where: {
        brandId,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This device already exists for the selected brand" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(`${brand.slug}-${name}`, async (candidate) =>
      Boolean(await prisma.device.findUnique({ where: { slug: candidate } }))
    );

    const device = await prisma.device.create({
      data: {
        name,
        slug,
        brandId,
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
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

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

    const brandId = Number(data.brandId);
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { name: true },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Select a valid brand" },
        { status: 400 }
      );
    }

    const name = normalizeDeviceName(data.name, brand.name);

    if (!normalizeEntityName(name)) {
      return NextResponse.json(
        { error: "Device name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.device.findFirst({
      where: {
        brandId,
        name: { equals: name, mode: "insensitive" },
        NOT: { id: Number(id) },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This device already exists for the selected brand" },
        { status: 400 }
      );
    }

    const updated = await prisma.device.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        brandId,
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
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

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
