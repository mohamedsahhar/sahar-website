"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Device = {
  id: number;
  name: string;
  brand: {
    name: string;
  };
};

export default function NewRepairPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    setError("");
    setSuccess("");

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////
    if (!title.trim()) {
      setError("Repair title is required.");
      return;
    }

    if (!deviceId) {
      setError("Please select a device.");
      return;
    }

    if (!problem.trim()) {
      setError("Problem description is required.");
      return;
    }

    if (!solution.trim()) {
      setError("Repair solution is required.");
      return;
    }

    //////////////////////////////////////////////////////
    // PREVENT MULTI CLICK
    //////////////////////////////////////////////////////
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          deviceId,
          problem,
          solution,
        }),
      });

      if (res.ok) {
        setSuccess("Repair case created successfully.");

        setTimeout(() => {
          router.push("/admin/cases");
        }, 1000);
      } else {
        setError("Failed to create repair case.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Create Repair Case
        </h1>

        <p className="text-gray-500 mt-2">
          Add a new repair article to your website database.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Repair Title *
            </label>

            <input
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Example: JBL PartyBox 310 Charging Port Repair"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Device *
            </label>

            <select
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setDeviceId(Number(e.target.value))}
              defaultValue=""
              disabled={loading}
            >
              <option value="">Select Device</option>

              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.brand.name} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Problem Description *
            </label>

            <textarea
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              rows={5}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Repair Solution *
            </label>

            <textarea
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
              rows={5}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              disabled={loading}
            />
          </div>

        </div>

        {/* Submit */}
        <div className="sticky bottom-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Creating Repair Case..." : "Create Repair Case"}
          </button>
        </div>

      </form>

    </div>
  );
}