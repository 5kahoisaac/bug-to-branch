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
      <body className="min-h-full flex flex-col">
        {children}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src={BUGDROP_SCRIPT_SRC}
          data-repo={BUGDROP_REPO}
          data-theme="dark"
          data-position="bottom-right"
          data-label="Send feedback"
          data-welcome="Spot a bug or idea? Share it and we will turn it into a GitHub issue."
          data-locale="en"
          data-inherit-font="true"
          data-radius="14"
          data-accent="#7c8bff"
          data-background="#101424"
          data-text="#eef2ff"
          data-border="#2a3152"
          data-shadow="0 20px 45px rgba(2, 6, 23, 0.6)"
        />
      </body>
    </html>
  );
}
