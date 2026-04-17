"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

export default function DevicesClient({ devices }: any) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("az")
  const [visible, setVisible] = useState(12)

  const filteredDevices = useMemo(() => {
    let items = [...devices]

    // Search
    if (search.trim()) {
      items = items.filter((device: any) =>
        `${device.brand?.name || ""} ${device.name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    // Sort
    if (sort === "az") {
      items.sort((a: any, b: any) =>
        `${a.brand?.name || ""} ${a.name}`.localeCompare(
          `${b.brand?.name || ""} ${b.name}`
        )
      )
    }

    if (sort === "za") {
      items.sort((a: any, b: any) =>
        `${b.brand?.name || ""} ${b.name}`.localeCompare(
          `${a.brand?.name || ""} ${a.name}`
        )
      )
    }

    return items
  }, [devices, search, sort])

  const shownDevices = filteredDevices.slice(0, visible)

  return (
    <div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setVisible(12)
          }}
          className="border rounded-lg px-4 py-3"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="az">Sort: A to Z</option>
          <option value="za">Sort: Z to A</option>
        </select>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {shownDevices.map((device: any) => (

          <Link
            key={device.id}
            href={`/devices/${device.slug}`}
            className="border rounded-xl p-5 hover:shadow-md transition bg-white"
          >

            <h3 className="font-semibold text-lg">
              {device.brand?.name} {device.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View repair cases →
            </p>

          </Link>

        ))}

      </div>

      {/* Empty */}
      {filteredDevices.length === 0 && (
        <p className="text-gray-500 mb-8">
          No devices found.
        </p>
      )}

      {/* Show More */}
      {visible < filteredDevices.length && (
        <div className="text-center mb-12">

          <button
            onClick={() => setVisible((prev) => prev + 12)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Show More
          </button>

        </div>
      )}

    </div>
  )
}