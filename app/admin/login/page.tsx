"use client"

import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  //////////////////////////////////////////////////////
  // LOAD SAVED LOCK STATUS
  //////////////////////////////////////////////////////
  useEffect(() => {
    const savedAttempts = localStorage.getItem("adminAttempts")
    const savedLock = localStorage.getItem("adminLockedUntil")

    if (savedAttempts) {
      setAttempts(Number(savedAttempts))
    }

    if (savedLock) {
      const lockTime = Number(savedLock)

      if (Date.now() < lockTime) {
        setLockedUntil(lockTime)
      } else {
        localStorage.removeItem("adminLockedUntil")
      }
    }
  }, [])

  //////////////////////////////////////////////////////
  // COUNTDOWN TIMER
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!lockedUntil) return

    const timer = setInterval(() => {
      const remain = Math.ceil((lockedUntil - Date.now()) / 1000)

      if (remain <= 0) {
        setLockedUntil(null)
        setAttempts(0)
        setTimeLeft(0)

        localStorage.removeItem("adminLockedUntil")
        localStorage.removeItem("adminAttempts")
      } else {
        setTimeLeft(remain)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockedUntil])

  //////////////////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////////////////
  async function handleLogin(e: any) {
    e.preventDefault()

    if (loading) return

    if (lockedUntil && Date.now() < lockedUntil) {
      setError(`Too many attempts. Try again in ${timeLeft}s`)
      return
    }

    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    })

    if (res?.error) {
      const newAttempts = attempts + 1

      setAttempts(newAttempts)
      localStorage.setItem("adminAttempts", String(newAttempts))

      if (newAttempts >= 5) {
        const lockTime = Date.now() + 10 * 60 * 1000

        setLockedUntil(lockTime)
        localStorage.setItem("adminLockedUntil", String(lockTime))
        setError("Too many attempts. Locked for 10 minutes.")
      } else {
        setError(`Invalid username or password (${newAttempts}/5)`)
      }

      setLoading(false)
      return
    }

    localStorage.removeItem("adminAttempts")
    localStorage.removeItem("adminLockedUntil")

    setAttempts(0)
    setLockedUntil(null)

    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 border"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Admin Login
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Sa7ar Quick Care Control Panel
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        <input
          placeholder="Username"
          className="border rounded-lg p-3 w-full mb-4 outline-none focus:ring-2 focus:ring-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!!lockedUntil || loading}
          autoComplete="username"
        />

        <div className="relative mb-5">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="border rounded-lg p-3 w-full pr-16 outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!lockedUntil || loading}
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={!!lockedUntil || loading}
          className="bg-black text-white w-full py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Signing in..."
            : lockedUntil
            ? `Locked (${timeLeft}s)`
            : "Login"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-5">
          Protected Admin Access
        </p>

      </form>

    </div>
  )
}