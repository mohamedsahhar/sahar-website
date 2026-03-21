"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function AdminLogin() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  async function handleLogin(e:any){
    e.preventDefault()

    await signIn("credentials",{
      username,
      password,
      callbackUrl:"/admin/dashboard"
    })
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

        <input
          placeholder="Username"
          className="border p-2 w-full mb-4"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-6"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  )
}