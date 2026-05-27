import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const includeDeleted = url.searchParams.get("includeDeleted") === "true"
    const includeInactive = url.searchParams.get("includeInactive") === "true"

    const subcategories = await prisma.subcategory.findMany({
      where: {
        ...(includeDeleted ? {} : { isDeleted: false }),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        category: true,
      },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    })

    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("GET SUBCATEGORIES ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const subcategory = await prisma.subcategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        categoryId: Number(body.categoryId),
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : true,
        isDeleted: false,
      },
    })

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error("CREATE SUBCATEGORY ERROR:", error)
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const id = Number(body.id)

    if (!id) {
      return NextResponse.json({ error: "Invalid subcategory ID" }, { status: 400 })
    }

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.slug === "string" ? { slug: body.slug } : {}),
        ...(body.categoryId ? { categoryId: Number(body.categoryId) } : {}),
        ...(typeof body.isActive === "boolean"
          ? { isActive: body.isActive }
          : {}),
        ...(typeof body.isDeleted === "boolean"
          ? {
              isDeleted: body.isDeleted,
              ...(body.isDeleted ? { isActive: false } : {}),
            }
          : {}),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error("UPDATE SUBCATEGORY ERROR:", error)
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 })
  }
}
