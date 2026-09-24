import type { Metadata } from "next";

import "./globals.css";

const BUGDROP_SCRIPT_SRC = "https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js";
const BUGDROP_REPO = "5kahoisaac/bug-to-branch";

export const metadata: Metadata = {
  title: "Bug to Branch",
  description: "Feedback in. Pull requests out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        {children}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src={BUGDROP_SCRIPT_SRC}
          data-repo={BUGDROP_REPO}
          data-theme="dark"
          data-position="bottom-right"
          data-label="BugDrop feedback"
          data-welcome="Spot a bug or idea? Share it and we will turn it into a GitHub issue."
          data-locale="en"
          data-inherit-font="true"
          data-radius="999"
          data-accent="#4f46e5"
          data-background="#111827"
          data-text="#eef2ff"
          data-border="#312e81"
          data-shadow="0 18px 40px rgba(15, 23, 42, 0.45)"
        />
      </body>
    </html>
  );
}
