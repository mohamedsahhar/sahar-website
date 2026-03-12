import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RepairInput = {
  title: string
  brand: string
  device: string
  problem: string
  solution: string
  image?: string
  beforeImage?: string
  afterImage?: string
  videoUrl?: string
  repairTime?: string
}

export async function POST(req: Request) {

  const data: RepairInput = await req.json();

  const slug = data.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const repair = await prisma.repairCase.create({
  data: {
    title: data.title,
    brand: data.brand,
    device: data.device,
    slug: slug,
    problem: data.problem,
    solution: data.solution,
    image: data.image ?? null,
    beforeImage: data.beforeImage ?? null,
    afterImage: data.afterImage ?? null,
    videoUrl: data.videoUrl ?? null,
    repairTime: data.repairTime ?? null,
  } as any
});

  return NextResponse.json(repair);
}

export async function GET() {

  const repairs = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(repairs);
}