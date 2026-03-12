"use client";

import { useState } from "react";

export default function AdminDashboard() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tiktok, setTiktok] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();

    const data = {
      title,
      category,
      description,
      tiktok
    };

    console.log("Repair Case:", data);

    alert("Repair case saved (demo version)");
  }

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>

      <h1>Create Repair Case</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        <input
          placeholder="Repair Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          placeholder="Category (Speaker, AirPods, Vacuum...)"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        />

        <textarea
          placeholder="Repair Description"
          rows={5}
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          placeholder="TikTok or Instagram Video Link"
          value={tiktok}
          onChange={(e)=>setTiktok(e.target.value)}
        />

        <button type="submit">
          Publish Repair Case
        </button>

      </form>

    </main>
  );
}