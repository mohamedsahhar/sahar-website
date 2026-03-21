import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
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
})

export { handler as GET, handler as POST }