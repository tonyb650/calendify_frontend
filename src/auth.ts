import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import prisma from "../lib/prisma";
import authConfig from "./auth.config";
import { getUserById } from "./db/users";


const authOptions: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({user}) {
      await prisma.user.update({
        where: { id: user.id},
        data: { emailVerified: new Date()}
      })
    }
  },
  callbacks: {
    async jwt({token}) {
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      token.earliest = existingUser.earliest
      token.latest = existingUser.latest
      return token
    },
    async session({ token, session}) {
      if (!session.user) return session
      if (token.sub) session.user.id = token.sub
      if (token.earliest) session.user.earliest = token.earliest as number
      if (token.earliest ) session.user.latest = token.latest as number
      return session
    },
    // async signIn({user}) {
    //   const existingUser = await getUserById(user.id)

    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false
    //   }
    //   return true
    // },
  },
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  ...authConfig
}

const nextAuth = NextAuth(authOptions)
const handlers = nextAuth.handlers
const GET = handlers.GET
const POST = handlers.POST
const auth = nextAuth.auth
const signIn = nextAuth.signIn
const signOut = nextAuth.signOut

export { auth, GET, POST, signIn, signOut };


/*
Traditional way to define our exports... cleaner code but a little harder to understand
export const {
  handlers: { GET, POST},
  auth
} = NextAuth({
  providers: [GitHub]
})
*/