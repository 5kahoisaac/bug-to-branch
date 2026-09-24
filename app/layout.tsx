import type { Metadata } from "next";

import "./globals.css";

const bugdropRepo = process.env.NEXT_PUBLIC_BUGDROP_REPO;

export const metadata: Metadata = {
  title: "Bug to Branch",
  description: "Feedback in. Pull requests out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasBugdropRepo = typeof bugdropRepo === "string" && bugdropRepo.trim().length > 0;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
        {hasBugdropRepo ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.BugDropConfig={repo:${JSON.stringify(
                  bugdropRepo,
                )},theme:"auto",position:"bottom-right",welcomeMessage:"Found a bug or have an idea? Tell us here."};`,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src="https://cdn.jsdelivr.net/npm/@bugdrop/widget@0.5.0/dist/bugdrop-widget.min.js" />
          </>
        ) : null}
        {!hasBugdropRepo && process.env.NODE_ENV !== "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                'console.warn("[Bug to Branch] NEXT_PUBLIC_BUGDROP_REPO is not set. BugDrop widget is disabled for local development.");',
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
