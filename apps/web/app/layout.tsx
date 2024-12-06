import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { NextAuthProvider } from "@/lib/NextAuthProvider";

export const metadata: Metadata = {
  title: "GameHub",
  description: "Created by Sheninth Jr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Navbar />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
