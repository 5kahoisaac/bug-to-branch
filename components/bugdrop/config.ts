// Everything project-specific for the BugDrop integration lives here.
// To reuse this folder elsewhere, copy it and edit this file.

export const BUGDROP_SCRIPT_SRC = "https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js";
export const BUGDROP_REPO = "5kahoisaac/bug-to-branch";

// Where BugDrop posts reports; derived from the pinned script's host.
export const BUGDROP_FEEDBACK_URL = `${new URL(BUGDROP_SCRIPT_SRC).origin}/api/feedback`;

// Used when the widget script hasn't loaded.
export const NEW_ISSUE_URL = `https://github.com/${BUGDROP_REPO}/issues/new`;

// Widget colors. Keep in sync with the site's tokens (globals.css here).
export const BUGDROP_THEME = {
  accent: "#6366f1",
  bg: "#111113",
  bgMuted: "#18181b",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  border: "#27272a",
  radius: 10,
} as const;

export const FEEDBACK_KINDS = [
  { value: "bug", label: "Bug", icon: "🐛", title: "Report a bug" },
  { value: "feature", label: "Feature", icon: "✨", title: "Suggest a feature" },
  { value: "question", label: "Question", icon: "❓", title: "Ask a question" },
] as const;

// Placeholder names; this sandbox has no real accounts.
export const REPORTERS = ["John Doe", "Jane Smith", "Alex Chen"] as const;

// Optional grouping labels. /triage-bugdrop applies them from the issue's "Labels" section.
export const GROUP_LABELS = [
  { name: "copies", description: "Wording, typos, or text content" },
  { name: "styling", description: "CSS: colors, fonts, spacing, visual glitches" },
  { name: "layout", description: "Alignment, overflow, or responsive breakage" },
  { name: "interaction", description: "Buttons, forms, or controls that misbehave" },
] as const;
