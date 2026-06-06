import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

// GET products. Public callers get only active, non-deleted products by default.
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const includeDeleted = url.searchParams.get("includeDeleted") === "true";
    const includeInactive = url.searchParams.get("includeInactive") === "true";

    if (includeDeleted || includeInactive) {
      const auth = await requireAdminSession();
      if ("response" in auth) {
        return auth.response;
      }
    }

    const products = await prisma.product.findMany({
      where: {
        ...(includeDeleted ? {} : { isDeleted: false }),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        brand: true,
        category: true,
        subcategory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// CREATE new product
export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const body = await req.json();

    if (!body.subcategoryId) {
      return NextResponse.json(
        { error: "Subcategory is required" },
        { status: 400 }
      );
    }

    const brand = body.brandId
      ? await prisma.brand.findUnique({
          where: { id: Number(body.brandId) },
          select: { name: true },
        })
      : null;
    const brandName = brand?.name || "Sa7ar Quick Care";
    const seoTitle = `${body.title} | ${brandName} Parts in Cairo | Sa7ar Quick Care`;
    const seoDescription = `Find ${body.title} for ${brandName} devices at Sa7ar Quick Care in Cairo. Contact us on WhatsApp for availability, condition, and shipping details.`;

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || "",

        brandId: Number(body.brandId),
        deviceId: body.deviceId ? Number(body.deviceId) : undefined,
        categoryId: Number(body.categoryId),
        subcategoryId: Number(body.subcategoryId),

        condition: body.condition || "New",
        stockStatus: body.stockStatus || "Available",

        images: body.images || [],
        colors: body.colors || [],
        shippingInfo: body.shippingInfo || "",

        featured: body.featured || false,
        seoTitle,
        seoDescription,
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : true,
        isDeleted: false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
