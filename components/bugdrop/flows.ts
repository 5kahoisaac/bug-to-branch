// BugDrop custom flows (https://bugdrop.dev/docs/custom-flows), one per category.
// The category must be fixed per flow so BugDrop still applies the bug/enhancement/question
// label. Reporter and grouping labels are picked in our own panel and passed as open() context.

import { BUGDROP_THEME, FEEDBACK_KINDS, GROUP_LABELS, REPORTERS } from "./config";
import { FLOW_DESCRIPTION_HEADING } from "./description-fix";

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]["value"];
export type Reporter = (typeof REPORTERS)[number];
export type GroupLabel = (typeof GROUP_LABELS)[number]["name"];

type FlowField =
  | { id: string; type: "shortText"; label: string; required?: boolean; maxLength?: number; placeholder?: string }
  | { id: string; type: "longText"; label: string; required?: boolean; rows?: number; placeholder?: string };

type FlowIssueSection =
  | { heading: string; answer: string; format?: "text" | "quote"; omitWhenEmpty?: boolean }
  | { heading: string; context: string; format?: "text" | "code"; omitWhenEmpty?: boolean };

export interface FeedbackFlowConfig {
  configVersion: 1;
  id: string;
  presentation: { kind: "modal"; size?: "compact" | "default" | "wide" };
  appearance?: { theme?: "light" | "dark" | "auto"; accentColor?: string };
  forms: Array<{ id: string; title: string; fields: FlowField[] }>;
  screens: Array<
    | { id: string; type: "form"; form: string }
    | { id: string; type: "screenshot"; mode: "optional" | "auto" | "required" }
  >;
  issue: { classification: FeedbackKind; title: string; sections: FlowIssueSection[] };
}

export interface FeedbackFlowContext {
  reporter: string;
  labels: string;
}

export interface FeedbackFlowHandle {
  id: string;
  open: (options?: { context?: FeedbackFlowContext }) => unknown;
}

declare global {
  interface Window {
    BugDrop?: {
      open: () => void;
      registerFlow?: (config: FeedbackFlowConfig) => FeedbackFlowHandle;
    };
  }
}

export function feedbackFlowId(kind: FeedbackKind): string {
  return `feedback-${kind}`;
}

export function buildFeedbackFlow(kind: FeedbackKind): FeedbackFlowConfig {
  const title = FEEDBACK_KINDS.find((entry) => entry.value === kind)?.title ?? "Send feedback";
  return {
    configVersion: 1,
    id: feedbackFlowId(kind),
    presentation: { kind: "modal", size: "default" },
    appearance: { theme: "dark", accentColor: BUGDROP_THEME.accent },
    forms: [
      {
        id: "report",
        title,
        fields: [
          { id: "title", type: "shortText", label: "Title", required: true, maxLength: 120 },
          { id: "description", type: "longText", label: "Description", required: true, rows: 5 },
        ],
      },
    ],
    screens: [
      { id: "report-screen", type: "form", form: "report" },
      { id: "screenshot-screen", type: "screenshot", mode: "optional" },
    ],
    issue: {
      classification: kind,
      title: "{{report.title}}",
      sections: [
        { heading: FLOW_DESCRIPTION_HEADING, answer: "report.description" },
        { heading: "Reporter", context: "reporter" },
        { heading: "Labels", context: "labels", omitWhenEmpty: true },
      ],
    },
  };
}

export function buildFlowContext(reporter: Reporter, labels: readonly GroupLabel[]): FeedbackFlowContext {
  const ordered = GROUP_LABELS.map((label) => label.name).filter((name) => labels.includes(name));
  return { reporter, labels: ordered.join(", ") };
}
