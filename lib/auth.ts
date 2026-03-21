import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {

        if (
          credentials?.username === "admin" &&
          credentials?.password === "sa7ar123"
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
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }