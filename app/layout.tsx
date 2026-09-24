import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BugDropTheme } from "@/components/bugdrop-theme";

import "./globals.css";

const BUGDROP_SCRIPT_SRC = "https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js";
const BUGDROP_REPO = "5kahoisaac/bug-to-branch";

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
        <BugDropTheme />
        {/* Widget theme mirrors the tokens in globals.css. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src={BUGDROP_SCRIPT_SRC}
          data-repo={BUGDROP_REPO}
          data-theme="dark"
          data-position="bottom-right"
          data-label="Feedback"
          data-welcome="false"
          data-locale="en"
          data-font="inherit"
          data-radius="10"
          data-border-width="1"
          data-color="#6366f1"
          data-bg="#111113"
          data-text="#fafafa"
          data-border-color="#27272a"
          data-shadow="soft"
        />
      </body>
    </html>
  );
}
