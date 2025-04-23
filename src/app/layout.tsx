import { Manrope } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.scss";
import AntdProvider from "@/providers/AntdRegistry";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import '@ant-design/v5-patch-for-react-19';

const geistManrope = Manrope({
  preload: false,
});

export const metadata: Metadata = {
  title: "Greenmove",
  description: "Rapport VINCI Greenmove",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistManrope.className} style={{ backgroundColor : "white"}}>
        <AntdProvider>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </AntdProvider>
      </body>
    </html>
  );
}