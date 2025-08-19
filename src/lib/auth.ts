/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ApiUser {
  id: string;
  email:string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth" {
  interface Session {
    user: ApiUser
  }
  interface User extends ApiUser {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        console.log('process.env.NEXT_PUBLIC_BASE_URI 11', process.env.NEXT_PUBLIC_BASE_URI);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        
        const user = await res.json();
        
        if (user?.data) {
          return user.data;
        } else {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if(user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;

      return session;
    },
  }
};