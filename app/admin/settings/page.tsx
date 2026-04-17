"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {

  const [workingHours, setWorkingHours] = useState("");
  const [daysOff, setDaysOff] = useState("");
  const [notice, setNotice] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const res = await fetch("/api/business");
      const data = await res.json();

      setWorkingHours(data.workingHours || "");
      setDaysOff(data.daysOff || "");
      setNotice(data.notice || "");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave(e: any) {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workingHours,
          daysOff,
          notice,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      alert("Settings saved successfully");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Business Settings
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (

        <form onSubmit={handleSave} className="space-y-5">

          {/* Working Hours */}
          <div>
            <label className="block font-medium mb-1">
              Working Hours
            </label>
            <input
              className="border p-2 w-full"
              placeholder="10:00 AM - 10:00 PM"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
            />
          </div>

          {/* Days Off */}
          <div>
            <label className="block font-medium mb-1">
              Day Off
            </label>
            <input
              className="border p-2 w-full"
              placeholder="Friday"
              value={daysOff}
              onChange={(e) => setDaysOff(e.target.value)}
            />
          </div>

          {/* Notice */}
          <div>
            <label className="block font-medium mb-1">
              Special Notice (Optional)
            </label>
            <textarea
              className="border p-2 w-full"
              placeholder="Closed for Eid from June 15 to June 20"
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
            />
          </div>

          <button
            disabled={saving}
            className="bg-black text-white px-5 py-2 rounded"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

        </form>

      )}

    </div>
  );
}