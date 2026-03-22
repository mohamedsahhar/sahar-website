import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {

  // 📊 Stats
  const totalRepairs = await prisma.repairCase.count();
  const totalDevices = await prisma.device.count();
  const totalBrands = await prisma.brand.count();

  // 🆕 Latest repairs
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

      <h2 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h2>

      <p className="text-gray-600 mb-8">
        Welcome to Sa7ar Quick Care Admin Panel
      </p>

      {/* 📊 Stats (POLISHED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <a
          href="/admin/repairs"
          className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Repairs</p>
          <p className="text-3xl font-bold mt-2">{totalRepairs}</p>
        </a>

        <a
          href="/admin/devices"
          className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Devices</p>
          <p className="text-3xl font-bold mt-2">{totalDevices}</p>
        </a>

        <a
          href="/admin/brands"
          className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md hover:-translate-y-1 transition block"
        >
          <p className="text-sm text-gray-500">Total Brands</p>
          <p className="text-3xl font-bold mt-2">{totalBrands}</p>
        </a>

      </div>

      {/* Existing Navigation Cards (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <a
          href="/admin/repairs"
          className="border rounded-lg p-6 hover:bg-gray-50"
        >
          <h3 className="font-semibold text-lg">
            Repair Cases
          </h3>
          <p className="text-sm text-gray-500">
            Manage repair articles
          </p>
        </a>

        <a
          href="/admin/brands"
          className="border rounded-lg p-6 hover:bg-gray-50"
        >
          <h3 className="font-semibold text-lg">
            Brands
          </h3>
          <p className="text-sm text-gray-500">
            Manage brands
          </p>
        </a>

        <a
          href="/admin/devices"
          className="border rounded-lg p-6 hover:bg-gray-50"
        >
          <h3 className="font-semibold text-lg">
            Devices
          </h3>
          <p className="text-sm text-gray-500">
            Manage device models
          </p>
        </a>

      </div>

      {/* 🆕 Latest Repairs */}
      <div className="mt-12">

        {/* Header + View All */}
        <div className="flex justify-between items-center mb-4">
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

            <p className="text-gray-500 text-sm">
              No repairs yet. Start by adding your first repair case.
            </p>

          ) : (

            latestRepairs.map((repair) => (
              <a
                key={repair.id}
                href={`/admin/repairs/${repair.id}/edit`}
                className="block border-b pb-2 hover:bg-gray-50 transition"
              >
                <p className="font-medium">{repair.title}</p>
                <p className="text-sm text-gray-500">
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