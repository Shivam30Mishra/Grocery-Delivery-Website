import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./app/lib/db"
import UserModel from "./models/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

export const { signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        try {
          await connectDB()
          const email = credentials.email
          const password = credentials.password as string
          const user = await UserModel.findOne({ email })
          if (!user) {
            throw new Error("User not found")
          }
          const isMatch = await bcrypt.compare(password, user.password as string)
          if (!isMatch) {
            throw new Error("Invalid credentials")
          }
          return user
        } catch (error) {
          console.log(error)
          return null
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user,account }) {
      if(account?.provider === "google"){
        await connectDB()
        let dbUser = await UserModel.findOne({email:user.email})
        dbUser = await UserModel.create({
          name:user.name,
          email:user.email,
          image:user.image,
        })
        dbUser.id = dbUser._id.toString()
        dbUser.role = dbUser.role
      }
      return true
    },
    // pushes users data inside token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    // pushes users data inside session
    session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string
          session.user.name = token.name as string
          session.user.email = token.email as string
          session.user.role = token.role as string
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1000 * 60 * 60 * 24 * 10 // 10 days
  },
  secret: process.env.AUTH_SECRET,
})
