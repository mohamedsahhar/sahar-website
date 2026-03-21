"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function AdminLogin() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e: any) {
    e.preventDefault()

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    console.log("LOGIN RESPONSE:", res) // 👈 DEBUG LINE

    // ❌ login failed
    if (res?.error) {
      setError("Invalid username or password")
      return
    }

    // ✅ login success
    window.location.href = "/admin/dashboard"
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
          <p className="text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          className="border p-2 w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  )
}