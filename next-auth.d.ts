import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "SUPER_ADMIN" | "ADMIN" | "EDITOR"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string | null
    role?: "SUPER_ADMIN" | "ADMIN" | "EDITOR"
  }
}