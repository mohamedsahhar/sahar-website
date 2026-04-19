"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleViewWebsite = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-10 px-6">

        <div className="mb-8 border-b pb-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Sa7ar Quick Care Admin
          </h1>

          <button
            onClick={handleViewWebsite}
            className="text-sm text-gray-600 hover:underline"
          >
            View Website
          </button>

        </div>

        <nav className="flex gap-6 mb-8 text-sm">

          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/repairs">Repair Cases</Link>
          <Link href="/admin/brands">Brands</Link>
          <Link href="/admin/devices">Devices</Link>
          <Link href="/admin/settings">Settings</Link>

        </nav>

        {children}

      </div>
    </div>
  );
}