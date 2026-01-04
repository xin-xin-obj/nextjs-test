import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GitLabProvider from "next-auth/providers/gitlab"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "next-auth/adapters"
import { db } from "@/server/db"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),

  // ✅ v4 + Credentials 强烈建议 JWT
  session: {
    strategy: "jwt",
  },

  providers: [
    GitLabProvider({
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        if (
          credentials.username !== "admin" ||
          credentials.password !== "123456"
        ) {
          return null
        }

        return {
          id: "1",
          name: "admin",
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],

  debug: true,
}

export default NextAuth(authOptions)
