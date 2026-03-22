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

      {/* 📊 Stats (CLICKABLE NOW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <a
          href="/admin/repairs"
          className="bg-white p-4 rounded-lg border hover:bg-gray-50 transition block"
        >
          <p className="text-sm text-gray-500">Total Repairs</p>
          <p className="text-2xl font-bold">{totalRepairs}</p>
        </a>

        <a
          href="/admin/devices"
          className="bg-white p-4 rounded-lg border hover:bg-gray-50 transition block"
        >
          <p className="text-sm text-gray-500">Total Devices</p>
          <p className="text-2xl font-bold">{totalDevices}</p>
        </a>

        <a
          href="/admin/brands"
          className="bg-white p-4 rounded-lg border hover:bg-gray-50 transition block"
        >
          <p className="text-sm text-gray-500">Total Brands</p>
          <p className="text-2xl font-bold">{totalBrands}</p>
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
      <div className="mt-10">

        <h3 className="text-xl font-semibold mb-4">
          Latest Repairs
        </h3>

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