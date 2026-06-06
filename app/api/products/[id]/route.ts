import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getProductId(context: ProductRouteContext) {
  const params = await context.params;
  const id = Number(params.id);

  if (!params.id || isNaN(id)) {
    return null;
  }

  return id;
}

// GET single product OR soft delete via legacy query link
export async function GET(req: Request, context: ProductRouteContext) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const id = await getProductId(context);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const url = new URL(req.url);
    const isDelete = url.searchParams.get("delete");

    if (isDelete === "true") {
      await prisma.product.update({
        where: { id },
        data: {
          isDeleted: true,
          isActive: false,
        },
      });

      return NextResponse.redirect(new URL("/admin/products", req.url));
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(req: Request, context: ProductRouteContext) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const id = await getProductId(context);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || "",

        brandId: Number(body.brandId),
        deviceId: body.deviceId ? Number(body.deviceId) : undefined,
        categoryId: Number(body.categoryId),

        subcategoryId: body.subcategoryId
          ? Number(body.subcategoryId)
          : undefined,

        condition: body.condition || "New",
        stockStatus: body.stockStatus || "Available",
        images: body.images || [],
        shippingInfo: body.shippingInfo || "",
        colors: body.colors || [],
        featured: Boolean(body.featured),
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// PARTIAL UPDATE product state
export async function PATCH(req: Request, context: ProductRouteContext) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const id = await getProductId(context);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : undefined,
        isDeleted:
          typeof body.isDeleted === "boolean" ? body.isDeleted : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// SOFT DELETE product
export async function DELETE(req: Request, context: ProductRouteContext) {
  try {
    const auth = await requireAdminSession();
    if ("response" in auth) {
      return auth.response;
    }

    const id = await getProductId(context);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
