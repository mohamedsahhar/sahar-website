"use client";

import { useState } from "react";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/admin/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      alert("User created successfully");
      window.location.href = "/admin";
    } else {
      alert("Error creating user");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create User</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="EDITOR">EDITOR</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create User
        </button>

      </form>
    </div>
  );
}