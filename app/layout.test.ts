import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("RootLayout BugDrop integration", () => {
  const layoutPath = resolve(process.cwd(), "app/layout.tsx");
  const layoutSource = readFileSync(layoutPath, "utf8");

  it("uses the official pinned hosted script", () => {
    expect(layoutSource).toContain(
      'https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js',
    );
  });

  it("targets this repository with exact data-repo", () => {
    expect(layoutSource).toContain('data-repo={BUGDROP_REPO}');
    expect(layoutSource).toContain('const BUGDROP_REPO = "5kahoisaac/bug-to-branch";');
  });
});
