"use client";

import { useState } from "react";

export default function NewCase() {

  const [form, setForm] = useState({
    title: "",
    brand: "",
    device: "",
    problem: "",
    solution: "",
    slug: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: form.title,
        brand: form.brand,
        device: form.device,
        slug: form.slug,
        problem: form.problem,
        solution: form.solution
      })
    });

    alert("Repair case saved!");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Repair Case</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 400
        }}
      >

        <input name="title" placeholder="Repair Title" onChange={handleChange} />
        <input name="brand" placeholder="Brand" onChange={handleChange} />
        <input name="device" placeholder="Device / Model" onChange={handleChange} />
        <input name="slug" placeholder="page-slug-example" onChange={handleChange} />

        <textarea name="problem" placeholder="Problem" onChange={handleChange} />
        <textarea name="solution" placeholder="Repair Solution" onChange={handleChange} />

        <button type="submit">Publish Case</button>

      </form>
    </div>
  );
}