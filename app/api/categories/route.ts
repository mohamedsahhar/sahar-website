import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/require-admin-session"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const includeDeleted = url.searchParams.get("includeDeleted") === "true"
    const includeInactive = url.searchParams.get("includeInactive") === "true"

    if (includeDeleted || includeInactive) {
      const auth = await requireAdminSession()
      if ("response" in auth) {
        return auth.response
      }
    }

    const categories = await prisma.category.findMany({
      where: {
        ...(includeDeleted ? {} : { isDeleted: false }),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        subcategories: {
          where: {
            ...(includeDeleted ? {} : { isDeleted: false }),
            ...(includeInactive ? {} : { isActive: true }),
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession()
    if ("response" in auth) {
      return auth.response
    }

    const body = await req.json()

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : true,
        isDeleted: false,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAdminSession()
    if ("response" in auth) {
      return auth.response
    }

    const body = await req.json()
    const id = Number(body.id)

    if (!id) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.slug === "string" ? { slug: body.slug } : {}),
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
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}
