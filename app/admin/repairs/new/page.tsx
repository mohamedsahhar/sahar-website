"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";

export default function NewRepairPage() {

  const router = useRouter();

  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);

  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [repairTime, setRepairTime] = useState("");

  const [brandId, setBrandId] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const [images, setImages] = useState<string[]>([]);

  const [image, setImage] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showDevicePopup, setShowDevicePopup] = useState(false);

  const [newBrandName, setNewBrandName] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");

  async function loadBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  }

  async function loadDevices() {
    const res = await fetch("/api/devices");
    const data = await res.json();
    setDevices(data);
  }

  useEffect(() => {
    loadBrands();
    loadDevices();
  }, []);

  const filteredDevices = devices.filter(
    (d: any) => d.brandId == brandId
  );

  async function createRepair(e: any) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const newErrors: any = {};

    if (!title) newErrors.title = "Title is required";
    if (!problem) newErrors.problem = "Problem is required";
    if (!brandId) newErrors.brandId = "Brand is required";
    if (!deviceId) newErrors.deviceId = "Device is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          problem,
          solution,
          repairTime: repairTime || null,
          deviceId: Number(deviceId),
          images,
          image: image || null,
          beforeImage: beforeImage || null,
          afterImage: afterImage || null,
          videoUrl: videoUrl || null
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create repair");
      }

      setSuccess("Repair created successfully");

      setTimeout(() => {
        router.push("/admin/repairs");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Problem *</label>
        <textarea
          className={`border p-2 w-full ${errors.problem ? "border-red-500" : ""}`}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <label>Solution</label>
        <textarea
          className="border p-2 w-full"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />

        <label>Repair Time</label>
        <input
          className="border p-2 w-full"
          value={repairTime}
          onChange={(e) => setRepairTime(e.target.value)}
        />

        {/* BRAND */}
        <label>Brand *</label>
        <div className="flex gap-2">
          <select
            className="border p-2 w-full"
            value={brandId}
            onChange={(e) => {
              setBrandId(e.target.value);
              setDeviceId("");
            }}
          >
            <option value="">Select Brand</option>
            {brands.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <button type="button" onClick={() => setShowBrandPopup(true)} className="bg-black text-white px-3">
            +
          </button>
        </div>

        {/* DEVICE */}
        <label>Device *</label>
        <div className="flex gap-2">
          <select
            className="border p-2 w-full"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          >
            <option value="">Select Device</option>
            {filteredDevices.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <button type="button" onClick={() => setShowDevicePopup(true)} className="bg-black text-white px-3">
            +
          </button>
        </div>

        {/* IMAGE */}
        <label>Gallery Images</label>

        <ImageUpload
          onUpload={(url: string) =>
            setImages((prev) => [...prev, url])
          }
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="rounded border" />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, index) => index !== i))
                  }
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
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button disabled={loading} className="bg-black text-white w-full py-2">
          {loading ? "Creating..." : "Create Repair"}
        </button>

      </form>

      {/* BRAND POPUP */}
      {showBrandPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Add Brand</h2>
            <input
              className="border p-2 w-full mb-2"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowBrandPopup(false)}>Cancel</button>
              <button
                onClick={async () => {
                  const res = await fetch("/api/brands", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newBrandName }),
                  });
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
            <input
              className="border p-2 w-full mb-2"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDevicePopup(false)}>Cancel</button>
              <button
                onClick={async () => {
                  const res = await fetch("/api/devices", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: newDeviceName,
                      brandId: Number(brandId),
                    }),
                  });
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