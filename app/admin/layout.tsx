"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleViewWebsite = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 md:px-6">

        {/* Header */}
        <div className="mb-6 md:mb-8 border-b pb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <h1 className="text-xl md:text-2xl font-bold leading-tight">
            Sa7ar Quick Care Admin
          </h1>

          <button
            onClick={handleViewWebsite}
            className="text-sm text-gray-600 hover:underline text-left md:text-right"
          >
            View Website
          </button>

        </div>

        {/* Navigation */}
        <nav className="grid grid-cols-2 md:flex gap-3 md:gap-6 mb-8 text-sm">

          <Link
            href="/admin"
            className="bg-white border rounded-lg px-4 py-3 text-center hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/repairs"
            className="bg-white border rounded-lg px-4 py-3 text-center hover:bg-gray-50 transition"
          >
            Repairs
          </Link>

          <Link
            href="/admin/brands"
            className="bg-white border rounded-lg px-4 py-3 text-center hover:bg-gray-50 transition"
          >
            Brands
          </Link>

          <Link
            href="/admin/devices"
            className="bg-white border rounded-lg px-4 py-3 text-center hover:bg-gray-50 transition"
          >
            Devices
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white border rounded-lg px-4 py-3 text-center hover:bg-gray-50 transition col-span-2 md:col-span-1"
          >
            Settings
          </Link>

        </nav>

        {children}

      </div>
    </div>
  );
}