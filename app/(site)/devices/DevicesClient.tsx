"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { getDeviceDisplayName } from "@/lib/naming"

export default function DevicesClient({ devices, brands, initialBrand = "" }: any) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("az")
  const validInitialBrand = brands.some((item: any) => item.slug === initialBrand)
    ? initialBrand
    : "all"
  const [brand, setBrand] = useState(validInitialBrand)
  const [visible, setVisible] = useState(12)

  const filteredDevices = useMemo(() => {
    let items = [...devices]

    if (brand !== "all") {
      items = items.filter(
        (device: any) =>
          device.brand?.slug === brand
      )
    }

    if (search.trim()) {
      items = items.filter((device: any) =>
        `${device.brand?.name || ""} ${device.name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

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
  }, [devices, search, sort, brand])

  const shownDevices = filteredDevices.slice(0, visible)

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
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
          value={brand}
          onChange={(e) => {
            const selectedBrand = e.target.value
            setBrand(selectedBrand)
            setVisible(12)
            window.history.replaceState(
              null,
              "",
              selectedBrand === "all"
                ? "/devices"
                : `/devices?brand=${encodeURIComponent(selectedBrand)}`
            )
          }}
          className="border rounded-lg px-4 py-3"
        >
          <option value="all">All Brands</option>
          {brands.map((item: any) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="az">Sort: A to Z</option>
          <option value="za">Sort: Z to A</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filteredDevices.length} devices found
      </p>

      {brand !== "all" && (
        <p className="mb-5 text-sm">
          <Link
            href={`/repairs/${brand}`}
            className="font-semibold text-orange-600 hover:underline"
          >
            View the complete {brands.find((item: any) => item.slug === brand)?.name} repair service page →
          </Link>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {shownDevices.map((device: any) => (
          <Link
            key={device.id}
            href={`/devices/${device.slug}`}
            className="border rounded-xl p-5 hover:shadow-md transition bg-white"
          >
            <h3 className="font-semibold text-lg">
              {getDeviceDisplayName(device.brand?.name, device.name)}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View repair cases →
            </p>
          </Link>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <p className="text-gray-500 mb-8">No devices found.</p>
      )}

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
