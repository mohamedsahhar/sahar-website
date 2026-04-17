import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET business info
export async function GET() {
  try {
    const data = await prisma.businessInfo.findFirst();

    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Get business info error:", error);

    return NextResponse.json(
      { error: "Failed to fetch business info" },
      { status: 500 }
    );
  }
}

// ✅ CREATE or UPDATE business info
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const existing = await prisma.businessInfo.findFirst();

    let result;

    if (existing) {
      // UPDATE
      result = await prisma.businessInfo.update({
        where: { id: existing.id },
        data: {
          workingHours: body.workingHours,
          daysOff: body.daysOff,
          notice: body.notice || null,
        },
      });
    } else {
      // CREATE
      result = await prisma.businessInfo.create({
        data: {
          workingHours: body.workingHours,
          daysOff: body.daysOff,
          notice: body.notice || null,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Save business info error:", error);

    return NextResponse.json(
      { error: "Failed to save business info" },
      { status: 500 }
    );
  }
}