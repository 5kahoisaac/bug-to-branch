import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BUGDROP_FEEDBACK_URL, BUGDROP_REPO, BUGDROP_SCRIPT_SRC, NEW_ISSUE_URL } from "./config";

describe("BugDrop integration config", () => {
  it("uses the official pinned hosted script", () => {
    expect(BUGDROP_SCRIPT_SRC).toBe("https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js");
  });

  it("targets this repository", () => {
    expect(BUGDROP_REPO).toBe("5kahoisaac/bug-to-branch");
    expect(NEW_ISSUE_URL).toBe("https://github.com/5kahoisaac/bug-to-branch/issues/new");
  });

  it("derives the feedback endpoint from the script host", () => {
    expect(BUGDROP_FEEDBACK_URL).toBe("https://bugdrop.neonwatty.workers.dev/api/feedback");
  });

  it("passes the repo to the script tag", () => {
    const source = readFileSync(resolve(__dirname, "bugdrop.tsx"), "utf8");
    expect(source).toContain("data-repo={BUGDROP_REPO}");
    expect(source).toContain('data-button="false"');
  });
});
