"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditRepairPage() {

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [brands,setBrands] = useState([]);
  const [devices,setDevices] = useState([]);

  const [title,setTitle] = useState("");
  const [problem,setProblem] = useState("");
  const [solution,setSolution] = useState("");
  const [repairTime,setRepairTime] = useState("");

  const [brandId,setBrandId] = useState("");
  const [deviceId,setDeviceId] = useState("");

  const [images,setImages] = useState<string[]>([]);
  const [dragIndex,setDragIndex] = useState<number | null>(null);

  const [videoUrl,setVideoUrl] = useState("");
  const [loading,setLoading] = useState(false);

  const [showBrandPopup,setShowBrandPopup] = useState(false);
  const [showDevicePopup,setShowDevicePopup] = useState(false);
  const [newBrandName,setNewBrandName] = useState("");
  const [newDeviceName,setNewDeviceName] = useState("");

  async function loadBrands(){
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  }

  async function loadDevices(){
    const res = await fetch("/api/devices");
    const data = await res.json();
    setDevices(data);
  }

  async function loadRepair() {
    const res = await fetch("/api/repairs");
    const data = await res.json();

    const repair = data.find((r: any) => String(r.id) === String(id));
    if (!repair) return;

    setTitle(repair.title || "");
    setProblem(repair.problem || "");
    setSolution(repair.solution || "");
    setRepairTime(repair.repairTime || "");

    setDeviceId(repair.deviceId?.toString() || "");
    setBrandId(repair.device?.brandId?.toString() || "");

    setImages(repair.images || []);
    setVideoUrl(repair.videoUrl || "");
  }

  useEffect(()=>{
    loadBrands();
    loadDevices();
    loadRepair();
  },[]);

  const filteredDevices = devices.filter(
    (d:any)=> d.brandId == brandId
  );

  function handleDragStart(index:number){
    setDragIndex(index);
  }

  function handleDrop(index:number){
    if (dragIndex === null) return;

    const newImages = [...images];
    const draggedItem = newImages[dragIndex];

    newImages.splice(dragIndex,1);
    newImages.splice(index,0,draggedItem);

    setImages(newImages);
    setDragIndex(null);
  }

  async function updateRepair(e:any){
    e.preventDefault();
    setLoading(true);

    await fetch("/api/repairs",{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        id,
        title,
        problem,
        solution,
        repairTime,
        deviceId:Number(deviceId),
        images,
        videoUrl
      })
    });

    alert("Repair updated");
    router.push("/admin/repairs");
  }

  return(

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Repair Case
      </h1>

      <form onSubmit={updateRepair} className="space-y-6">

        {/* BASIC */}
        <div className="border p-4 rounded-xl space-y-5">
          <h2 className="font-semibold text-lg">Basic Information</h2>

          <label>Title</label>
          <input className="border p-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} />

          <label>Problem</label>
          <textarea className="border p-2 w-full" value={problem} onChange={(e)=>setProblem(e.target.value)} />

          <label>Solution</label>
          <textarea className="border p-2 w-full" value={solution} onChange={(e)=>setSolution(e.target.value)} />

          <label>Repair Time</label>
          <input className="border p-2 w-full" value={repairTime} onChange={(e)=>setRepairTime(e.target.value)} />

          {/* BRAND */}
          <label>Brand</label>
          <div className="flex gap-2">
            <select
              className="border p-2 w-full"
              value={brandId}
              onChange={(e)=>{
                setBrandId(e.target.value);
                setDeviceId("");
              }}
            >
              <option value="">Select Brand</option>
              {brands.map((b:any)=>(
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <button type="button" onClick={()=>setShowBrandPopup(true)} className="bg-black text-white px-3">
              +
            </button>
          </div>

          {/* DEVICE */}
          <label>Device</label>
          <div className="flex gap-2">
            <select
              className="border p-2 w-full"
              value={deviceId}
              onChange={(e)=>setDeviceId(e.target.value)}
            >
              <option value="">Select Device</option>
              {filteredDevices.map((d:any)=>(
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <button type="button" onClick={()=>setShowDevicePopup(true)} className="bg-black text-white px-3">
              +
            </button>
          </div>

        </div>

        {/* GALLERY */}
        <div className="border p-4 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Gallery (Drag to reorder)</h2>

          <ImageUpload
            slug={makeSlug(title)}
            existingImages={images}
            onUpload={(url:string)=>
              setImages((prev)=>[...prev,url])
            }
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img,i)=>(
                <div
                  key={i}
                  draggable
                  onDragStart={()=>handleDragStart(i)}
                  onDragOver={(e)=>e.preventDefault()}
                  onDrop={()=>handleDrop(i)}
                  className="relative border rounded p-1 cursor-move"
                >
                  <img src={img} className="rounded"/>
                  <button
                    type="button"
                    onClick={()=>setImages(images.filter((_,index)=>index !== i))}
                    className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <label>Video URL</label>
          <input
            className="border p-2 w-full"
            value={videoUrl}
            onChange={(e)=>setVideoUrl(e.target.value)}
          />
        </div>

        <button className="bg-black text-white px-5 py-2 rounded">
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>

      {/* BRAND POPUP */}
      {showBrandPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Add Brand</h2>
            <input className="border p-2 w-full mb-2" value={newBrandName} onChange={(e)=>setNewBrandName(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowBrandPopup(false)}>Cancel</button>
              <button
                onClick={async ()=>{
                  const res = await fetch("/api/brands",{method:"POST",headers:{ "Content-Type":"application/json" },body:JSON.stringify({name:newBrandName})});
                  const newBrand = await res.json();
                  await loadBrands();
                  setBrandId(newBrand.id);
                  setShowBrandPopup(false);
                }}
                className="bg-black text-white px-3 py-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEVICE POPUP */}
      {showDevicePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Add Device</h2>
            <input className="border p-2 w-full mb-2" value={newDeviceName} onChange={(e)=>setNewDeviceName(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowDevicePopup(false)}>Cancel</button>
              <button
                onClick={async ()=>{
                  const res = await fetch("/api/devices",{method:"POST",headers:{ "Content-Type":"application/json" },body:JSON.stringify({name:newDeviceName,brandId:Number(brandId)})});
                  const newDevice = await res.json();
                  await loadDevices();
                  setDeviceId(newDevice.id);
                  setShowDevicePopup(false);
                }}
                className="bg-black text-white px-3 py-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
