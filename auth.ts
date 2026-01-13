import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
// Your own logic for dealing with plaintext password strings; be careful!
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./server/db/index"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  // providers:[GitHub],
  adapter: DrizzleAdapter(db),
})
