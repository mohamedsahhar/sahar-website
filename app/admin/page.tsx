import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("sa7ar_admin");

  if (!adminCookie || adminCookie.value !== "yes") {
    redirect("/admin/login");
  }

  const totalRepairs = await prisma.repairCase.count();
  const totalDevices = await prisma.device.count();
  const totalBrands = await prisma.brand.count();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <a
          href="/admin/repairs"
          className="border rounded-xl p-6 bg-white shadow"
        >
          <p className="text-gray-500 mb-2">Total Repairs</p>
          <p className="text-3xl font-bold">{totalRepairs}</p>
        </a>

        <a
          href="/admin/devices"
          className="border rounded-xl p-6 bg-white shadow"
        >
          <p className="text-gray-500 mb-2">Total Devices</p>
          <p className="text-3xl font-bold">{totalDevices}</p>
        </a>

        <a
          href="/admin/brands"
          className="border rounded-xl p-6 bg-white shadow"
        >
          <p className="text-gray-500 mb-2">Total Brands</p>
          <p className="text-3xl font-bold">{totalBrands}</p>
        </a>

      </div>
    </div>
  );
}