"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleViewWebsite = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-3 border-b pb-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="min-w-0 break-words text-2xl font-bold">
            Sa7ar Quick Care Admin
          </h1>

          <button
            onClick={handleViewWebsite}
            className="w-full text-left text-sm text-gray-600 hover:underline sm:w-auto sm:text-right"
          >
            View Website
          </button>
        </div>

        <div className="mb-8 max-w-full overflow-x-auto">
          <nav className="flex min-w-0 gap-4 whitespace-nowrap pb-1 text-sm sm:gap-6">
            <Link href="/admin" className="text-gray-700 hover:underline">
              Dashboard
            </Link>

            <Link
              href="/admin/repairs"
              className="text-gray-700 hover:underline"
            >
              Repair Cases
            </Link>

            <Link href="/admin/brands" className="text-gray-700 hover:underline">
              Brands
            </Link>

            <Link href="/admin/devices" className="text-gray-700 hover:underline">
              Devices
            </Link>

            <Link
              href="/admin/products"
              className="text-gray-700 hover:underline"
            >
              Products
            </Link>

            <Link
              href="/admin/categories"
              className="text-gray-700 hover:underline"
            >
              Categories
            </Link>

            <Link
              href="/admin/subcategories"
              className="text-gray-700 hover:underline"
            >
              Subcategories
            </Link>

            <Link
              href="/admin/settings"
              className="text-gray-700 hover:underline"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="min-w-0 max-w-full">{children}</div>
      </div>
    </div>
  );
}
