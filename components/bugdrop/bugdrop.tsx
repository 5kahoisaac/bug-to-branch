import { BugDropClient } from "./client";
import { BUGDROP_REPO, BUGDROP_SCRIPT_SRC, BUGDROP_THEME } from "./config";

// Drop this once at the end of <body> in the root layout.
export function BugDrop() {
  return (
    <>
      <BugDropClient />
      {/* BugDrop's own button is hidden; FeedbackLauncher replaces it. */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src={BUGDROP_SCRIPT_SRC}
        data-repo={BUGDROP_REPO}
        data-theme="dark"
        data-button="false"
        data-welcome="false"
        data-locale="en"
        data-font="inherit"
        data-radius={BUGDROP_THEME.radius}
        data-border-width="1"
        data-color={BUGDROP_THEME.accent}
        data-bg={BUGDROP_THEME.bg}
        data-text={BUGDROP_THEME.text}
        data-border-color={BUGDROP_THEME.border}
        data-shadow="soft"
      />
    </>
  );
}
