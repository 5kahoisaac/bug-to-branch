import { describe, expect, it } from "vitest";

import { FEEDBACK_KINDS, GROUP_LABELS, REPORTERS } from "./config";
import { buildFeedbackFlow, buildFlowContext, feedbackFlowId } from "./flows";

describe("feedback flow config", () => {
  it("offers three placeholder reporters", () => {
    expect(REPORTERS).toEqual(["John Doe", "Jane Smith", "Alex Chen"]);
  });

  it("offers copies and styling among the grouping labels", () => {
    const names = GROUP_LABELS.map((label) => label.name);
    expect(names).toContain("copies");
    expect(names).toContain("styling");
  });

  it("builds one flow per kind, classified so BugDrop keeps its category label", () => {
    for (const { value } of FEEDBACK_KINDS) {
      const flow = buildFeedbackFlow(value);
      expect(flow.id).toBe(feedbackFlowId(value));
      expect(flow.issue.classification).toBe(value);
    }
  });

  it("writes reporter and labels into the issue from open() context", () => {
    const { sections } = buildFeedbackFlow("bug").issue;
    expect(sections).toContainEqual({ heading: "Reporter", context: "reporter" });
    expect(sections).toContainEqual({ heading: "Labels", context: "labels", omitWhenEmpty: true });
  });

  it("titles the issue from a required answer", () => {
    const flow = buildFeedbackFlow("feature");
    const titleField = flow.forms[0].fields.find((field) => field.id === "title");
    expect(flow.issue.title).toBe("{{report.title}}");
    expect(titleField?.required).toBe(true);
  });
});

describe("buildFlowContext", () => {
  it("joins selected labels in canonical order", () => {
    expect(buildFlowContext("Jane Smith", ["styling", "copies"])).toEqual({
      reporter: "Jane Smith",
      labels: "copies, styling",
    });
  });

  it("leaves labels empty when none are selected so the section is omitted", () => {
    expect(buildFlowContext("John Doe", []).labels).toBe("");
  });
});
