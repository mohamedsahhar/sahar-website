import Link from "next/link"

export default function AdminCases() {
  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Repair Cases
      </h1>

      <div className="mb-8">
        <Link
          href="/admin/cases/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add New Case
        </Link>
      </div>

      <div className="border rounded-lg p-6">

        <p className="text-gray-500">
          Repair cases will appear here once they are added.
        </p>

      </div>

    </div>
  )
}