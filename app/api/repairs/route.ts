import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createUniqueSlug,
  normalizeEntityName,
} from "@/lib/naming";

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

    const title = normalizeEntityName(data.title);
    const problem = String(data.problem ?? "").trim();

    if (!title || !problem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title, async (candidate) =>
      Boolean(await prisma.repairCase.findUnique({ where: { slug: candidate } }))
    );

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
        title,
        slug,
        problem,
        solution: String(data.solution ?? "").trim(),
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
        title: normalizeEntityName(data.title),
        problem: String(data.problem ?? "").trim(),
        solution: String(data.solution ?? "").trim(),
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
