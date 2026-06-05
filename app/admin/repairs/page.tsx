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
    <div className="mx-auto w-full max-w-6xl min-w-0 px-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="min-w-0 break-words text-2xl font-bold">Repair Cases</h1>

        <Link href="/admin/repairs/new">
          <button className="w-full rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 sm:w-auto">
            + New Repair
          </button>
        </Link>
      </div>

      {repairs.length === 0 && <p className="text-gray-500">No repairs found.</p>}

      {repairs.length > 0 && (
        <div className="max-w-full overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] text-sm">
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
                  <td className="max-w-0 break-words p-3 font-medium">
                    {repair.title}
                  </td>

                  <td className="max-w-0 break-words p-3 text-gray-600">
                    {repair.device?.brand?.name} {repair.device?.name}
                  </td>

                  <td className="max-w-0 break-words p-3 text-xs text-gray-400">
                    {repair.slug}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <Link href={`/admin/repairs/${repair.id}/edit`}>
                        <button className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => deleteRepair(repair.id)}
                        className="rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
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
