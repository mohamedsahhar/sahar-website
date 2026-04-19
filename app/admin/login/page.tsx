"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function AdminLogin() {
  const { status } = useSession()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  //////////////////////////////////////////////////////
  // AUTO REDIRECT IF ALREADY LOGGED IN
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/admin"
    }
  }, [status])

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

    if (lockedUntil && Date.now() < lockedUntil) {
      setError(`Too many attempts. Try again in ${timeLeft}s`)
      return
    }

    setError("")

    const res = await signIn("credentials", {
      username,
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

      return
    }

    localStorage.removeItem("adminAttempts")
    localStorage.removeItem("adminLockedUntil")

    setAttempts(0)
    setLockedUntil(null)

    window.location.href = "/admin"
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
          disabled={!!lockedUntil}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!!lockedUntil}
        />

        <button
          type="submit"
          disabled={!!lockedUntil}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {lockedUntil ? `Locked (${timeLeft}s)` : "Login"}
        </button>

      </form>

    </div>
  )
}