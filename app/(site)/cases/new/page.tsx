"use client";

import { useState, useEffect } from "react";

type Brand = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
  brandId: number;
};

export default function NewCase() {

  const [brands, setBrands] = useState<Brand[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    device: "",
    problem: "",
    solution: "",
    slug: ""
  });

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data));

    fetch("/api/admin/devices")
      .then(res => res.json())
      .then(data => setDevices(data));
  }, []);

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

  const filteredDevices = devices.filter((d) => {
    const brand = brands.find(b => b.name === form.brand);
    if (!brand) return true;
    return d.brandId === brand.id;
  });

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

        <input
          name="title"
          placeholder="Repair Title"
          onChange={handleChange}
        />

        <select name="brand" onChange={handleChange}>
          <option value="">Select Brand</option>

          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <select name="device" onChange={handleChange}>
          <option value="">Select Device</option>

          {filteredDevices.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          name="slug"
          placeholder="page-slug-example"
          onChange={handleChange}
        />

        <textarea
          name="problem"
          placeholder="Problem"
          onChange={handleChange}
        />

        <textarea
          name="solution"
          placeholder="Repair Solution"
          onChange={handleChange}
        />

        <button type="submit">
          Publish Case
        </button>

      </form>
    </div>
  );
}