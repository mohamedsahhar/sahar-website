"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditDevicePage() {

  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [name, setName] = useState("")
  const [brandId, setBrandId] = useState("")
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadBrands() {
    const res = await fetch("/api/brands")
    const data = await res.json()
    setBrands(data)
  }

  async function loadDevice() {
    const res = await fetch("/api/devices")
    const data = await res.json()

    const device = data.find((d:any) => String(d.id) === String(id))

    if (!device) return

    setName(device.name || "")
    setBrandId(device.brandId?.toString() || "")
  }

  useEffect(() => {
    loadBrands()
    loadDevice()
  }, [])

  async function updateDevice(e:any) {
    e.preventDefault()
    setLoading(true)

    await fetch("/api/devices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        name,
        brandId: Number(brandId)
      })
    })

    alert("Device updated")
    router.push("/admin/devices")
  }

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Device
      </h1>

      <form onSubmit={updateDevice} className="space-y-4">

        <div>
          <label className="block text-sm mb-1">Device Name</label>
          <input
            className="border p-2 w-full rounded-md"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Brand</label>
          <select
            className="border p-2 w-full rounded-md"
            value={brandId}
            onChange={(e)=>setBrandId(e.target.value)}
          >
            <option value="">Select Brand</option>

            {brands.map((brand:any)=>(
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">

          <button
            type="button"
            onClick={()=>router.push("/admin/devices")}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  )
}