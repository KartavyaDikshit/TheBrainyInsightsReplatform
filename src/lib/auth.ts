import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@tbi/database"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const result = await db.query("SELECT * FROM users WHERE email = $1", [credentials.email as string])
        const user = result.rows[0]

        if (!user || !await bcrypt.compare(credentials.password as string, user.password as string)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.first_name, // Changed to first_name to match database
        }
      }
    })
  ],

  session: { strategy: "jwt" },
  
  callbacks: {
    async jwt({ token, user }) {
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
      }
      return session
    },
  },
})