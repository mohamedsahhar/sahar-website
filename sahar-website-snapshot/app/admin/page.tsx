export default function AdminDashboard() {
  return (
    <div>

      <h2 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h2>

      <p className="text-gray-600 mb-8">
        Welcome to Sa7ar Quick Care Admin Panel
      </p>

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

    </div>
  )
}