import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return brands;
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>

        <Link href="/admin/brands/new">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            + Add Brand
          </button>
        </Link>
      </div>

      {/* Brands List */}
      <div className="space-y-4">
        {brands.map((brand: any) => (
          <div
            key={brand.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <span className="font-medium">{brand.name}</span>

            <div className="flex gap-2">

              <Link href={`/admin/brands/${brand.id}/edit`}>
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
              </Link>

              <form
                action={async () => {
                  "use server";

                  await prisma.brand.delete({
                    where: {
                      id: brand.id,
                    },
                  });
                }}
              >
                <button
                  type="submit"
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </form>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}