export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        Sa7ar Quick Care Admin
      </h1>

      <p className="text-gray-600 mb-10">
        Manage repair cases and website content from the admin panel.
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        <a
          href="/admin/cases"
          className="border rounded-lg p-6 hover:shadow transition"
        >
          <h2 className="font-semibold text-lg mb-2">
            Repair Cases
          </h2>
          <p className="text-gray-500">
            View and manage repair cases
          </p>
        </a>

        <a
          href="/admin/cases/new"
          className="border rounded-lg p-6 hover:shadow transition"
        >
          <h2 className="font-semibold text-lg mb-2">
            Create Repair Case
          </h2>
          <p className="text-gray-500">
            Add a new repair case
          </p>
        </a>

      </div>

    </div>
  );
}