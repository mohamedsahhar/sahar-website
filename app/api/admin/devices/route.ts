import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){

 const devices = await prisma.device.findMany({
  include:{ brand:true },
  orderBy:{ id:"desc" }
});

  return NextResponse.json(devices);
}
