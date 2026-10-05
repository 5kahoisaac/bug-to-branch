"use client";

import type { ComponentProps } from "react";

import { NEW_ISSUE_URL } from "./config";
import { OPEN_FEEDBACK_EVENT } from "./feedback-launcher";

// An in-page link that opens the feedback panel. Unstyled: pass className, or wrap it with
// your button component (e.g. shadcn `<Button asChild>`). Falls back to GitHub's new-issue
// form if the widget script hasn't loaded.
export function FeedbackLink({ onClick, ...props }: ComponentProps<"a">) {
  return (
    <a
      href={NEW_ISSUE_URL}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !window.BugDrop?.registerFlow) return;
        event.preventDefault();
        window.dispatchEvent(new Event(OPEN_FEEDBACK_EVENT));
      }}
    />
  );
}
