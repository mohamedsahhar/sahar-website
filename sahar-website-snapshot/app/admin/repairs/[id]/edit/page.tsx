"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditRepairPage() {

  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [brands,setBrands] = useState([])
  const [devices,setDevices] = useState([])

  const [title,setTitle] = useState("")
  const [problem,setProblem] = useState("")
  const [solution,setSolution] = useState("")
  const [repairTime,setRepairTime] = useState("")

  const [brandId,setBrandId] = useState("")
  const [deviceId,setDeviceId] = useState("")

  const [image,setImage] = useState("")
  const [beforeImage,setBeforeImage] = useState("")
  const [afterImage,setAfterImage] = useState("")
  const [videoUrl,setVideoUrl] = useState("")

  const [loading,setLoading] = useState(false)

  async function loadBrands(){
    const res = await fetch("/api/brands")
    const data = await res.json()
    setBrands(data)
  }

  async function loadDevices(){
    const res = await fetch("/api/devices")
    const data = await res.json()
    setDevices(data)
  }

 async function loadRepair() {
  try {
    const res = await fetch("/api/repairs");
    const data = await res.json();

    // 🛑 Safety check
    if (!Array.isArray(data)) {
      console.error("API did not return array:", data);
      return;
    }

    const repair = data.find((r: any) => String(r.id) === String(id));

    // 🛑 If not found
    if (!repair) {
      console.error("Repair not found for id:", id);
      return;
    }

    // 🧠 DEBUG (safe)
    console.log("Loaded repair:", repair);

    // ✅ Set values
    setTitle(repair.title || "");
    setProblem(repair.problem || "");
    setSolution(repair.solution || "");

    // 🔥 IMPORTANT FIX (handles undefined)
    setRepairTime(repair.repairTime ? String(repair.repairTime) : "");

    setDeviceId(repair.deviceId?.toString() || "");
    setBrandId(repair.device?.brandId?.toString() || "");

    setImage(repair.image || "");
    setBeforeImage(repair.beforeImage || "");
    setAfterImage(repair.afterImage || "");
    setVideoUrl(repair.videoUrl || "");

  } catch (err) {
    console.error("Error loading repair:", err);
  }
}
  useEffect(()=>{
    loadBrands()
    loadDevices()
    loadRepair()
  },[])

  const filteredDevices = devices.filter(
    (d:any)=> d.brandId == brandId
  )

  async function updateRepair(e:any){
    e.preventDefault()
    setLoading(true)

    await fetch("/api/repairs",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id,
        title,
        problem,
        solution,
        repairTime,
        deviceId:Number(deviceId),
        image,
        beforeImage,
        afterImage,
        videoUrl
      })
    })

    alert("Repair updated")
    router.push("/admin/repairs")
  }

  return(

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Repair Case
      </h1>

      <form onSubmit={updateRepair} className="space-y-6">

        {/* Basic Info */}
        <div className="border p-4 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="border p-2 w-full rounded-md"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Problem</label>
            <textarea
              className="border p-2 w-full rounded-md"
              value={problem}
              onChange={(e)=>setProblem(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Solution</label>
            <textarea
              className="border p-2 w-full rounded-md"
              value={solution}
              onChange={(e)=>setSolution(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Repair Time</label>
            <input
              className="border p-2 w-full rounded-md"
              value={repairTime}
              onChange={(e)=>setRepairTime(e.target.value)}
            />
          </div>
        </div>

        {/* Device Selection */}
        <div className="border p-4 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Device</h2>

          <div>
            <label className="block text-sm mb-1">Brand</label>
            <select
              className="border p-2 w-full rounded-md"
              value={brandId || ""}
              onChange={(e)=>{
                setBrandId(e.target.value)
                setDeviceId("")
              }}
            >
              <option value="">Select Brand</option>
              {brands.map((brand:any)=>(
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Device</label>
            <select
              className="border p-2 w-full rounded-md"
              value={deviceId || ""}
              onChange={(e)=>setDeviceId(e.target.value)}
            >
              <option value="">Select Device</option>
              {filteredDevices.map((device:any)=>(
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Media */}
        <div className="border p-4 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Media</h2>

          <input
            className="border p-2 w-full rounded-md"
            value={image}
            onChange={(e)=>setImage(e.target.value)}
            placeholder="Main Image URL"
          />

          <input
            className="border p-2 w-full rounded-md"
            value={beforeImage}
            onChange={(e)=>setBeforeImage(e.target.value)}
            placeholder="Before Image URL"
          />

          <input
            className="border p-2 w-full rounded-md"
            value={afterImage}
            onChange={(e)=>setAfterImage(e.target.value)}
            placeholder="After Image URL"
          />

          <input
            className="border p-2 w-full rounded-md"
            value={videoUrl}
            onChange={(e)=>setVideoUrl(e.target.value)}
            placeholder="Video URL"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">

          <button
            type="button"
            onClick={()=>router.push("/admin/repairs")}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  )
}