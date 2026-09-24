"use client";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    BugDrop?: { open: () => void };
  }
}

// Falls back to GitHub's issue form if the widget script hasn't loaded.
const FALLBACK_HREF = "https://github.com/5kahoisaac/bug-to-branch/issues/new";

export function ReportFeedbackButton({ children }: { children: React.ReactNode }) {
  return (
    <Button asChild size="lg">
      <a
        href={FALLBACK_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          if (!window.BugDrop) return;
          event.preventDefault();
          window.BugDrop.open();
        }}
      >
        {children}
      </a>
    </Button>
  );
}
