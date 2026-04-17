"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Basic anti-bruteforce cooldown
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  async function handleLogin(e: any) {
    e.preventDefault();

    // block if cooldown active
    if (lockedUntil && Date.now() < lockedUntil) {
      setError("Too many attempts. Please wait 30 seconds.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    // ❌ login failed
    if (res?.error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // after 5 failed tries = lock 30 sec
      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 30000);
        setAttempts(0);
        setError("Too many attempts. Please wait 30 seconds.");
      } else {
        setError("Invalid username or password");
      }

      return;
    }

    // ✅ success reset protection
    setAttempts(0);
    setLockedUntil(null);

    window.location.replace("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-[350px]"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          className="border p-2 w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>

      </form>

    </div>
  );
}