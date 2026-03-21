import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const dynamic = "force-dynamic"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        if (
          credentials.username === "admin" &&
          credentials.password === "sa7ar123"
        ) {
          return {
            id: "1",
            name: "Admin",
          }
        }

        return null
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
  if (session.user) {
    ;(session.user as any).id = token.id
    session.user.name = token.name as string
  }
  return session
},
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }