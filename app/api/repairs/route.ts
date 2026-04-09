import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RepairInput = {
  title: string;
  deviceId?: number;
  problem: string;
  solution: string;
  repairTime?: string;

  // ✅ NEW SYSTEM ONLY
  images?: string[];

  videoUrl?: string;

  // 👇 optional fallback input (not stored in DB directly)
  image?: string;
  beforeImage?: string;
  afterImage?: string;
};

export async function GET() {
  const repairs = await prisma.repairCase.findMany({
    include: {
      device: {
        include: {
          brand: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(repairs);
}

export async function POST(req: Request) {
  try {
    const data: RepairInput = await req.json();

    if (!data.title || !data.problem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await prisma.repairCase.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Repair with this slug already exists" },
        { status: 400 }
      );
    }

    // ✅ SAFE IMAGE BUILDING (supports old inputs)
    const images =
      data.images && data.images.length > 0
        ? data.images
        : [
            data.image,
            data.beforeImage,
            data.afterImage,
          ].filter((img): img is string => Boolean(img));

    const repair = await prisma.repairCase.create({
      data: {
        title: data.title,
        slug,
        problem: data.problem,
        solution: data.solution,
        repairTime: data.repairTime ?? null,

        // ✅ ONLY FIELD IN DB
        images,

        videoUrl: data.videoUrl ?? null,

        device: data.deviceId
          ? { connect: { id: Number(data.deviceId) } }
          : undefined,
      },
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error("Create repair error:", error);

    return NextResponse.json(
      { error: "Failed to create repair case" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.repairCase.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete repair error:", error);

    return NextResponse.json(
      { error: "Failed to delete repair" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "Missing repair ID" },
        { status: 400 }
      );
    }

    const images =
      data.images && data.images.length > 0
        ? data.images
        : [
            data.image,
            data.beforeImage,
            data.afterImage,
          ].filter((img): img is string => Boolean(img));

    const updated = await prisma.repairCase.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: data.title,
        problem: data.problem,
        solution: data.solution,
        repairTime: data.repairTime ?? null,

        // ✅ ONLY FIELD
        images,

        videoUrl: data.videoUrl ?? null,

        device: data.deviceId
          ? { connect: { id: Number(data.deviceId) } }
          : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update repair error:", error);

    return NextResponse.json(
      { error: "Failed to update repair" },
      { status: 500 }
    );
  }
}