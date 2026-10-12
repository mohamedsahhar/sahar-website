import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createUniqueSlug,
  normalizeEntityName,
} from "@/lib/naming";

type RepairInput = {
  title: string
  deviceId: number
  problem: string
  solution: string
  images?: string[]
  videoUrl?: string
  repairTime?: string
};

export async function POST(req: Request) {
  try {

    const data: RepairInput = await req.json();

    const title = normalizeEntityName(data.title);
    const problem = String(data.problem ?? "").trim();

    if (!title || !problem || !data.deviceId) {
      return NextResponse.json(
        { error: "Title, problem, and device are required" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title, async (candidate) =>
      Boolean(await prisma.repairCase.findUnique({ where: { slug: candidate } }))
    );

    const repair = await prisma.repairCase.create({
  data: {
    title,

    slug: slug,

    device: {
      connect: { id: data.deviceId }
    },

    problem,
    solution: String(data.solution ?? "").trim(),

    images: data.images ?? [],
    videoUrl: data.videoUrl ?? null,
    repairTime: data.repairTime ?? null,
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

export async function GET() {
  try {

    const repairs = await prisma.repairCase.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(repairs);

  } catch (error) {

    console.error("Fetch repairs error:", error);

    return NextResponse.json(
      { error: "Failed to fetch repair cases" },
      { status: 500 }
    );
  }
}
