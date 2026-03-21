"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function NewRepairPage() {

  const router = useRouter()

  const [brands, setBrands] = useState([])
  const [devices, setDevices] = useState([])

  const [title, setTitle] = useState("")
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState("")
  const [repairTime, setRepairTime] = useState("")

  const [brandId, setBrandId] = useState("")
  const [deviceId, setDeviceId] = useState("")

  const [image, setImage] = useState("")
  const [beforeImage, setBeforeImage] = useState("")
  const [afterImage, setAfterImage] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showBrandPopup, setShowBrandPopup] = useState(false)
  const [showDevicePopup, setShowDevicePopup] = useState(false)

  const [newBrandName, setNewBrandName] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")

  async function loadBrands() {
    const res = await fetch("/api/brands")
    const data = await res.json()
    setBrands(data)
  }

  async function loadDevices() {
    const res = await fetch("/api/devices")
    const data = await res.json()
    setDevices(data)
  }

  useEffect(() => {
    loadBrands()
    loadDevices()
  }, [])

  const filteredDevices = devices.filter(
    (d: any) => d.brandId == brandId
  )

  async function createRepair(e: any) {
    e.preventDefault()

    setError("")
    setSuccess("")

    const newErrors: any = {}

    if (!title) newErrors.title = "Title is required"
    if (!problem) newErrors.problem = "Problem is required"
    if (!brandId) newErrors.brandId = "Brand is required"
    if (!deviceId) newErrors.deviceId = "Device is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    try {
      setLoading(true)

      await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          problem,
          solution,
          repairTime,
          deviceId: Number(deviceId),
          image,
          beforeImage,
          afterImage,
          videoUrl
        })
      })

      setSuccess("Repair created successfully")

      setTimeout(() => {
        router.push("/admin/repairs")
      }, 1000)

    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function createBrand() {
    if (!newBrandName) return

    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrandName })
    })

    const created = await res.json()

    setShowBrandPopup(false)
    setNewBrandName("")
    await loadBrands()
    setBrandId(created.id)
  }

  async function createDevice() {
    if (!newDeviceName || !brandId) return

    const res = await fetch("/api/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newDeviceName,
        brandId: Number(brandId)
      })
    })

    const created = await res.json()

    setShowDevicePopup(false)
    setNewDeviceName("")
    await loadDevices()
    setDeviceId(created.id)
  }

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Create Repair Case
      </h1>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}

      <form onSubmit={createRepair} className="space-y-4">

        <label>Repair Title *</label>
        <input
          className={`border p-2 w-full ${errors.title ? "border-red-500" : ""}`}
          placeholder="Example: iPhone 11 Charging Issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Problem *</label>
        <textarea
          className={`border p-2 w-full ${errors.problem ? "border-red-500" : ""}`}
          placeholder="Describe the issue..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <label>Solution</label>
        <textarea
          className="border p-2 w-full"
          placeholder="Explain how the repair was done..."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />

        <label>Repair Time</label>
        <input
          className="border p-2 w-full"
          placeholder="Example: 1 hour"
          value={repairTime}
          onChange={(e) => setRepairTime(e.target.value)}
        />

        <label>Brand *</label>
        <select
          className={`border p-2 w-full ${errors.brandId ? "border-red-500" : ""}`}
          value={brandId || ""}
          onChange={(e) => {
            setBrandId(e.target.value)
            setDeviceId("")
          }}
        >
          <option value="">Select Brand</option>
          {brands.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <button type="button" onClick={() => setShowBrandPopup(true)}>+ Add Brand</button>

        <label>Device *</label>
        <select
          className={`border p-2 w-full ${errors.deviceId ? "border-red-500" : ""}`}
          value={deviceId || ""}
          onChange={(e) => setDeviceId(e.target.value)}
        >
          <option value="">Select Device</option>
          {filteredDevices.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <button type="button" onClick={() => setShowDevicePopup(true)}>+ Add Device</button>

        <label>Main Image</label>
        <input className="border p-2 w-full" placeholder="/repairs/device.jpg" value={image} onChange={(e)=>setImage(e.target.value)} />

        <label>Before Image</label>
        <input className="border p-2 w-full" placeholder="/repairs/before.jpg" value={beforeImage} onChange={(e)=>setBeforeImage(e.target.value)} />

        <label>After Image</label>
        <input className="border p-2 w-full" placeholder="/repairs/after.jpg" value={afterImage} onChange={(e)=>setAfterImage(e.target.value)} />

        <label>Video URL</label>
        <input className="border p-2 w-full" placeholder="https://youtube.com/..." value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} />

        <button disabled={loading} className="bg-black text-white w-full py-2">
          {loading ? "Creating..." : "Create Repair"}
        </button>

      </form>

      {/* BRAND POPUP */}
      {showBrandPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2>Add Brand</h2>
            <input className="border p-2 w-full mb-3" placeholder="Example: Apple" value={newBrandName} onChange={(e)=>setNewBrandName(e.target.value)} />
            <div className="flex justify-between">
              <button onClick={()=>setShowBrandPopup(false)}>Cancel</button>
              <button onClick={createBrand}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DEVICE POPUP */}
      {showDevicePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2>Add Device</h2>
            <input className="border p-2 w-full mb-3" placeholder="Example: iPhone 11" value={newDeviceName} onChange={(e)=>setNewDeviceName(e.target.value)} />
            <div className="flex justify-between">
              <button onClick={()=>setShowDevicePopup(false)}>Cancel</button>
              <button onClick={createDevice}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}