import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  // 🔒 Protect page
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // 📊 Stats
  const totalRepairs = await prisma.repairCase.count();
  const totalDevices = await prisma.device.count();
  const totalBrands = await prisma.brand.count();

  // 🆕 Latest Repairs
  const latestRepairs = await prisma.repairCase.findMany({
    orderBy: { id: "desc" },
    take: 5,
    include: {
      device: {
        include: { brand: true },
      },
    },
  });

  return (
    <div>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h2>

        <p className="text-gray-500 mt-2">
          Welcome back to Sa7ar Quick Care Control Center
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <a
          href="/admin/repairs"
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Repairs</p>
          <p className="text-4xl font-bold mt-2">{totalRepairs}</p>
        </a>

        <a
          href="/admin/devices"
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Devices</p>
          <p className="text-4xl font-bold mt-2">{totalDevices}</p>
        </a>

        <a
          href="/admin/brands"
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Brands</p>
          <p className="text-4xl font-bold mt-2">{totalBrands}</p>
        </a>

      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <a
            href="/admin/repairs/new"
            className="bg-black text-white rounded-xl p-5 hover:opacity-90 transition"
          >
            Add Repair
          </a>

          <a
            href="/admin/devices"
            className="bg-white border rounded-xl p-5 hover:bg-gray-50 transition"
          >
            Manage Devices
          </a>

          <a
            href="/admin/brands"
            className="bg-white border rounded-xl p-5 hover:bg-gray-50 transition"
          >
            Manage Brands
          </a>

          <a
            href="/admin/settings"
            className="bg-white border rounded-xl p-5 hover:bg-gray-50 transition"
          >
            Settings
          </a>

        </div>
      </div>

      {/* Latest Repairs */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold">
            Latest Repairs
          </h3>

          <a
            href="/admin/repairs"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </a>
        </div>

        <div className="space-y-3">

          {latestRepairs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No repairs yet. Start by adding your first repair case.
            </p>
          ) : (
            latestRepairs.map((repair) => (
              <a
                key={repair.id}
                href={`/admin/repairs/${repair.id}/edit`}
                className="block border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <p className="font-semibold">
                  {repair.title}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {repair.device?.brand?.name} — {repair.device?.name}
                </p>
              </a>
            ))
          )}

        </div>

      </div>

    </div>
  );
}