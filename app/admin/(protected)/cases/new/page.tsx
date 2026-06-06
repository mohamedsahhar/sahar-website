"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Device = {
  id: number
  name: string
  brand: {
    name: string
  }
}

export default function NewRepairPage() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetch("/api/devices")
      .then(res => res.json())
      .then(data => setDevices(data));
  }, []);

  async function handleSubmit(e: any) {

    e.preventDefault();

    const res = await fetch("/api/cases", {
      method: "POST",
      body: JSON.stringify({
        title,
        deviceId,
        problem,
        solution
      })
    });

    if (res.ok) {
      router.push("/admin/cases");
    } else {
      alert("Error creating repair case");
    }

  }

  return (

    <div className="max-w-2xl">

      <h1 className="text-3xl font-bold mb-6">
        Create Repair Case
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Repair Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        {/* Device selector */}

        <select
          className="w-full border p-2 rounded"
          onChange={(e)=>setDeviceId(Number(e.target.value))}
        >

          <option>Select Device</option>

          {devices.map((d)=>(
            <option key={d.id} value={d.id}>
              {d.brand.name} — {d.name}
            </option>
          ))}

        </select>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Problem description"
          rows={4}
          value={problem}
          onChange={(e)=>setProblem(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Repair solution"
          rows={4}
          value={solution}
          onChange={(e)=>setSolution(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Save Repair Case
        </button>

      </form>

    </div>
  );
}