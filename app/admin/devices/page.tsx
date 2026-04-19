"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");

  // NEW FILTERS
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  async function loadDevices() {
    const res = await fetch("/api/devices");
    const data = await res.json();
    setDevices(data);
  }

  async function loadBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  }

  useEffect(() => {
    loadDevices();
    loadBrands();
  }, []);

  async function addDevice() {
    if (!name || !brandId) return;

    await fetch("/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        brandId,
      }),
    });

    setName("");
    setBrandId("");
    loadDevices();
  }

  //////////////////////////////////////////////////////
  // FILTERED DATA
  //////////////////////////////////////////////////////
  const filteredDevices = devices.filter((device: any) => {
    const matchSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.slug.toLowerCase().includes(search.toLowerCase()) ||
      device.brand?.name.toLowerCase().includes(search.toLowerCase());

    const matchBrand =
      !filterBrand || String(device.brand?.id) === filterBrand;

    return matchSearch && matchBrand;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Manage Devices
      </h1>

      {/* Add Device */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <select
          className="border p-2 rounded-md"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
        >
          <option value="">Select Brand</option>

          {brands.map((brand: any) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded-md flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Device name"
        />

        <button
          onClick={addDevice}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Add
        </button>

      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">

        <input
          className="border p-2 rounded-md"
          placeholder="Search device / slug / brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-md"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="">All Brands</option>

          {brands.map((brand: any) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

      </div>

      {/* Empty */}
      {filteredDevices.length === 0 && (
        <p className="text-gray-500">
          No devices found.
        </p>
      )}

      {/* Table */}
      {filteredDevices.length > 0 && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Device</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Slug</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((device: any) => (
                <tr key={device.id} className="border-t">

                  <td className="p-3 font-medium">
                    {device.name}
                  </td>

                  <td className="p-3 text-gray-600">
                    {device.brand?.name}
                  </td>

                  <td className="p-3 text-xs text-gray-400">
                    {device.slug}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">

                      <Link href={`/admin/devices/${device.id}/edit`}>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700">
                          Edit
                        </button>
                      </Link>

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