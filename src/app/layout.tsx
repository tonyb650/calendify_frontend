import type { Metadata } from "next";
import { Geist, Geist_Mono, Zain } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const zainFont = Zain({
  variable: "--font-zain",
  subsets: ["latin"],
  weight: ["400"]
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
        className={`${geistSans.variable} ${geistMono.variable} ${zainFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}