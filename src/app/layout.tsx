import Navbar from "@/components/NavBar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/db/users";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Calendify",
  description: "Deep-Learning-Powered task scheduler"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback="Loading...">
          <AwaitedNavbar />
        </Suspense>
        <main className="max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}

const AwaitedNavbar = async () => {
  const user = await getCurrentUser() || undefined
  
  return <Navbar user={user} />
};
