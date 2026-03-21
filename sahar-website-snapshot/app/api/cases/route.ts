import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RepairInput = {
  title: string
  deviceId: number
  problem: string
  solution: string
  image?: string
  beforeImage?: string
  afterImage?: string
  videoUrl?: string
  repairTime?: string
};

export async function POST(req: Request) {
  try {

    const data: RepairInput = await req.json();

    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const repair = await prisma.repairCase.create({
  data: {
    title: data.title,

    slug: slug,

    device: {
      connect: { id: data.deviceId }
    },

    problem: data.problem,
    solution: data.solution,

    image: data.image ?? null,
    beforeImage: data.beforeImage ?? null,
    afterImage: data.afterImage ?? null,
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
