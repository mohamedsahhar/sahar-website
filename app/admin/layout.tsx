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

          <a
            href="/"
            className="text-sm text-gray-600 hover:underline"
          >
            View Website
          </a>

        </div>

        {children}

      </div>

    </div>
  )
}