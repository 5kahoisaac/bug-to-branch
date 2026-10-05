import { BUGDROP_FEEDBACK_URL } from "./config";

// BugDrop's server prefixes every report with "## Description", and a custom flow's output
// always starts with its first section heading, which we name the same. Strip ours from the
// outgoing payload so the issue has one Description heading. If BugDrop changes its request
// shape, this no-ops and the issue just shows the heading twice.
export const FLOW_DESCRIPTION_HEADING = "Description";

const LEADING_HEADING = `## ${FLOW_DESCRIPTION_HEADING}\n\n`;

export function stripLeadingDescriptionHeading(description: string): string {
  return description.startsWith(LEADING_HEADING) ? description.slice(LEADING_HEADING.length) : description;
}

export function rewriteFeedbackBody(body: string): string {
  try {
    const payload: unknown = JSON.parse(body);
    if (typeof payload !== "object" || payload === null || !("description" in payload)) return body;
    const { description } = payload;
    if (typeof description !== "string") return body;
    return JSON.stringify({ ...payload, description: stripLeadingDescriptionHeading(description) });
  } catch {
    return body;
  }
}

let isInstalled = false;

export function installDescriptionFix() {
  if (isInstalled) return;
  isInstalled = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const isFeedbackPost =
      typeof input === "string" && input === BUGDROP_FEEDBACK_URL && init?.method === "POST" && typeof init.body === "string";
    if (!isFeedbackPost) return originalFetch(input, init);
    return originalFetch(input, { ...init, body: rewriteFeedbackBody(init.body as string) });
  };
}
