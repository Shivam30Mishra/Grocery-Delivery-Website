import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import UserModel from "@/models/user.model"
import connectDB from "./app/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ================= CREDENTIALS =================
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB()

        const email = credentials.email.toLowerCase().trim()

        const user = await UserModel.findOne({ email })

        // User not found
        if (!user) return null

        // Block credentials login for Google-only users
        if (user.provider && user.provider !== "credentials") {
          return null
        }

        // Password check
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password as string
        )

        if (!isMatch) return null

        // ✅ Return plain object ONLY
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),

    // ================= GOOGLE =================
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ================= SIGN IN =================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB()

        const email = user.email?.toLowerCase()

        if (!email) return false

        let dbUser = await UserModel.findOne({ email })

        // Block Google login for credentials users
        if (dbUser && dbUser.provider === "credentials") {
          return false
        }

        // Create user if not exists
        if (!dbUser) {
          dbUser = await UserModel.create({
            name: user.name,
            email,
            image: user.image,
            provider: "google",
            role: "user",
          })
        }

        // Attach DB values to token
        user.id = dbUser._id.toString()
        user.role = dbUser.role
      }

      return true
    },

    // ================= JWT =================
    async jwt({ token, user }) {
  // On initial login
  if (user) {
    token.id = user.id
    token.role = user.role
  }
  // On subsequent requests → re-sync role from DB
  else if (token?.id) {
    await connectDB()
    const dbUser = await UserModel.findById(token.id)
    if (dbUser) {
      token.role = dbUser.role
    }
  }
  return token
}

,

    // ================= SESSION =================
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 10, // 10 days
  },

  secret: process.env.AUTH_SECRET,
})
