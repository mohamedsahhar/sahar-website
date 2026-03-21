import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto py-10 px-6">

        <div className="mb-8 border-b pb-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Sa7ar Quick Care Admin
          </h1>

          <Link
            href="/"
            className="text-sm text-gray-600 hover:underline"
          >
            View Website
          </Link>

        </div>

        {/* Admin Navigation */}

        <nav className="flex gap-6 mb-8 text-sm">

          <Link
            href="/admin"
            className="text-gray-700 hover:underline"
          >
            Dashboard
          </Link>

          <Link
          href="/admin/repairs"
          className="text-gray-700 hover:underline"
          >
          Repair Cases
          </Link>

          <Link
            href="/admin/brands"
            className="text-gray-700 hover:underline"
          >
            Brands
          </Link>

          <Link
            href="/admin/devices"
            className="text-gray-700 hover:underline"
          >
            Devices
          </Link>

        </nav>

        {children}

      </div>

    </div>
  )
}