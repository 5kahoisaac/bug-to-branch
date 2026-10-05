import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BugDrop } from "@/components/bugdrop";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bug to Branch",
  description: "Sandbox for testing BugDrop reports as GitHub issues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
        <BugDrop />
      </body>
    </html>
  );
}
