"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch brand data
  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();

        const brand = data.find((b: any) => b.id == id);

        if (brand) {
          setName(brand.name);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading brand:", error);
        setLoading(false);
      }
    }

    fetchBrand();
  }, [id]);

  // ✅ Handle update
 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  console.log("Sending:", { id, name }); // 👈 ADD THIS

  const res = await fetch("/api/brands", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
      }),
    });

    if (res.ok) {
      router.push("/admin/brands");
      router.refresh();
    } else {
      alert("Failed to update brand");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Brand</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Brand
        </button>

      </form>
    </div>
  );
}