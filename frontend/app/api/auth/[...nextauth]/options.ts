import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      // ! IMP: used to set the scope of the access token
      // ! below will provide complete access to all repos
      authorization: {
        params: {
          //   scope: "repo user",
          // scope: "user",
        },
      },
    }),
  ],
  session: {
    // ! IMP: session data is stored directly in a JWT token
    strategy: "jwt",
    maxAge: 60 * 60 * 1, // ! one hour
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      const jwt = token as JWT & { accessToken?: string };
      if (account && account.access_token) {
        jwt.accessToken = account.access_token;
      }
      return jwt;
    },
    session: async ({ session, token }) => {
      const customSession = session as Session & { accessToken: string };
      customSession.accessToken = (
        token as JWT & { accessToken: string }
      ).accessToken;
      return customSession;
    },
  },
};
