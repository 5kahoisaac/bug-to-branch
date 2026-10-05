import { describe, expect, it } from "vitest";

import { rewriteFeedbackBody, stripLeadingDescriptionHeading } from "./description-fix";

describe("stripLeadingDescriptionHeading", () => {
  it("removes the flow's leading Description heading", () => {
    expect(stripLeadingDescriptionHeading("## Description\n\nClipped name\n\n## Reporter\n\nJohn Doe")).toBe(
      "Clipped name\n\n## Reporter\n\nJohn Doe",
    );
  });

  it("leaves other descriptions untouched", () => {
    expect(stripLeadingDescriptionHeading("Clipped name")).toBe("Clipped name");
    expect(stripLeadingDescriptionHeading("## Descriptions\n\nx")).toBe("## Descriptions\n\nx");
  });
});

describe("rewriteFeedbackBody", () => {
  it("rewrites only the description field", () => {
    const body = JSON.stringify({ title: "T", description: "## Description\n\nText", category: "bug" });
    expect(JSON.parse(rewriteFeedbackBody(body))).toEqual({ title: "T", description: "Text", category: "bug" });
  });

  it("passes through bodies it doesn't understand", () => {
    expect(rewriteFeedbackBody("not json")).toBe("not json");
    expect(rewriteFeedbackBody('{"title":"T"}')).toBe('{"title":"T"}');
  });
});
