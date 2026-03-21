"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);

  async function loadRepairs() {
    const res = await fetch("/api/repairs");
    const data = await res.json();
    setRepairs(data);
  }

  useEffect(() => {
    loadRepairs();
  }, []);

  async function deleteRepair(id: number) {
    const confirmDelete = confirm("Are you sure you want to delete this repair?");
    if (!confirmDelete) return;

    await fetch("/api/repairs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadRepairs();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repair Cases</h1>

        <Link href="/admin/repairs/new">
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
            + New Repair
          </button>
        </Link>
      </div>

      {/* Empty State */}
      {repairs.length === 0 && (
        <p className="text-gray-500">No repairs found.</p>
      )}

      {/* Table */}
      {repairs.length > 0 && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Device</th>
                <th className="p-3">Slug</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {repairs.map((repair) => (
                <tr key={repair.id} className="border-t">

                  {/* Title */}
                  <td className="p-3 font-medium">
                    {repair.title}
                  </td>

                  {/* Device */}
                  <td className="p-3 text-gray-600">
                    {repair.device?.brand?.name} {repair.device?.name}
                  </td>

                  {/* Slug */}
                  <td className="p-3 text-gray-400 text-xs">
                    {repair.slug}
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex justify-end gap-2">

                      <Link href={`/admin/repairs/${repair.id}/edit`}>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => deleteRepair(repair.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}