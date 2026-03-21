"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ImageUpload from "@/app/components/ImageUpload"; // ✅ ADDED

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

      const repair = data.find((r: any) => String(r.id) === String(id));
      if (!repair) return;

      setTitle(repair.title || "");
      setProblem(repair.problem || "");
      setSolution(repair.solution || "");
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

          <input className="border p-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea className="border p-2 w-full" value={problem} onChange={(e)=>setProblem(e.target.value)} />
          <textarea className="border p-2 w-full" value={solution} onChange={(e)=>setSolution(e.target.value)} />
          <input className="border p-2 w-full" value={repairTime} onChange={(e)=>setRepairTime(e.target.value)} />
        </div>

        {/* Media */}
        <div className="border p-4 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Media</h2>

          {/* 🔥 MAIN IMAGE */}
          <label>Main Image</label>
          <ImageUpload onUpload={(url)=>setImage(url)} />
          <input
            className="border p-2 w-full"
            value={image}
            onChange={(e)=>setImage(e.target.value)}
          />

          {/* 🔥 BEFORE IMAGE */}
          <label>Before Image</label>
          <ImageUpload onUpload={(url)=>setBeforeImage(url)} />
          <input
            className="border p-2 w-full"
            value={beforeImage}
            onChange={(e)=>setBeforeImage(e.target.value)}
          />

          {/* 🔥 AFTER IMAGE */}
          <label>After Image</label>
          <ImageUpload onUpload={(url)=>setAfterImage(url)} />
          <input
            className="border p-2 w-full"
            value={afterImage}
            onChange={(e)=>setAfterImage(e.target.value)}
          />

          <label>Video URL</label>
          <input
            className="border p-2 w-full"
            value={videoUrl}
            onChange={(e)=>setVideoUrl(e.target.value)}
          />
        </div>

        <button className="bg-black text-white px-5 py-2 rounded">
          Save Changes
        </button>

      </form>

    </div>
  )
}