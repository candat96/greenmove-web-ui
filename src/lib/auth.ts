import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 29 * 24 * 60 * 60, // 29 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json();
        if (user.data.token) {
          return user.data.token
        } else {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user
      }
      return token;
    },
    async session({ session }) {
      // if (token) {
      //   const { accessToken }: any = token
      //   const decoded: any = jwtDecode(accessToken)
      //   if (decoded) {
      //     session.user = decoded
      //     session.expires = new Date(decoded.exp * 1000)
      //     session.maxAge = decoded.exp - Math.floor(Date.now() / 1000)
      //   }
      //   session.token = accessToken
      // }
      return session
    }
  },
};
