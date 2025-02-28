import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
// import { cookies } from 'next/headers';

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    token?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    idToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: { params: { scope: "openid profile user.Read email" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token as string;
        token.accessToken = account.access_token as string;
      }
      try {
        const resUser = await fetch("https://graph.microsoft.com/v1.0/me", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          }
        })
        if (resUser) {
          const user = await resUser.json()
          const resLogin = await fetch(`${process.env.BASE_URI}/login`, {
            method: 'POST',
            body: JSON.stringify({
              ...user,
              microsoftId: user.id
            }),
            headers: { "Content-Type": "application/json" }
          })
          if (resLogin) {
            const login = await resLogin.json()
            if (login.statusCode === 200) {
              token.token = login.data?.accessToken as string;
              token.refreshToken = login.data?.refreshToken as string;
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.token = token.token as string;
      session.refreshToken = token.refreshToken as string;
      // cookies().set('idToken', session.idToken);
      return session;
    },
  },
};
