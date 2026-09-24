# Automation design (original plan, not built)

> **Superseded.** Triage currently runs locally through the Claude Code skill [`/triage-bugdrop`](../.claude/skills/triage-bugdrop/SKILL.md), scheduled by [`LOOP.md`](../LOOP.md). This document is the original design for a GitHub Actions version and is kept for reference. Differences: the skill picks issues by BugDrop category label (`bug`, `enhancement`, `question`) instead of `agent-ready`, answers questions, and gets feature approval through an "ok" reply on a posted plan.

This repository plans an approval-gated issue-to-PR workflow that is scheduled and manually dispatchable.

## Scope and triggers

- Trigger: `schedule` and `workflow_dispatch`.
- Candidate issues: only **open** issues labeled both `bugdrop` and `agent-ready`.
- Accepted issue types: `bug` and `enhancement`.
- Ignored issue type: `question`.
- Process at most one issue per run to keep behavior predictable.

## Trust boundaries and safety constraints

Treat all issue-linked input as untrusted, including:

- issue title and body
- comments
- screenshot text / OCR output
- linked attachments

Required constraints:

- Never push directly to `main`.
- Never auto-merge.
- Never expose repository/model-provider secrets to code originating from an issue.
- Reject unexpected modifications to protected files (workflow files, secret/config files, dependency manager configs) unless a maintainer explicitly approves.
- Enforce changed-file and diff-size limits before opening a PR.

## Lifecycle labels

Use labels to model state transitions:

- `agent-ready`: triaged and approved for automation.
- `agent-working`: currently being processed by one automation run.
- `agent-pr-open`: draft PR opened.
- `agent-blocked`: automation halted and awaiting maintainer intervention.

## Branch and duplicate prevention

- Working branch name: `agent/issue-<number>`.
- Before creating work, check for:
  - existing branch `agent/issue-<number>`
  - existing open pull request referencing that issue
- If found, stop and label/update issue to avoid duplicate work.

## Quality gates

Before publishing any branch or opening a PR, run:

1. formatting
2. linting
3. type-checking
4. tests
5. production build

Any failure should set `agent-blocked` and preserve logs.

## Draft PR rules

- Open a **draft** PR only.
- Include `Closes #<issue-number>` in PR body.
- Require human review for every generated PR.

## Adapter boundary (provider-agnostic)

The workflow should call a provider adapter interface rather than provider-specific commands directly. This keeps the orchestration stable while allowing future coding-agent backends.

```ts
interface CodingAgentAdapter {
  plan(context: IssueContext): Promise<PlanResult>;
  implement(context: IssueContext, plan: PlanResult): Promise<ImplementationResult>;
}
```

Only this adapter layer should change when introducing an agent provider.

## Scanner pseudocode

```text
runWorkflow():
  candidates = listOpenIssuesWithLabels(["bugdrop", "agent-ready"])
  candidate = firstEligible(candidates where issueType in ["bug", "enhancement"])
  if no candidate:
    exit success

  issueNumber = candidate.number
  branchName = "agent/issue-" + issueNumber

  if branchExists(branchName) or pullRequestExistsForIssue(issueNumber):
    annotateIssue(issueNumber, "Duplicate work detected; skipping")
    return

  moveLabel(issueNumber, remove="agent-ready", add="agent-working")

  context = collectUntrustedInputs(candidate)
  guardedContext = sanitize(context)

  checkoutBranch(branchName)
  result = adapter.implement(guardedContext, adapter.plan(guardedContext))

  if touchesProtectedFilesWithoutApproval(result.diff):
    moveLabel(issueNumber, remove="agent-working", add="agent-blocked")
    stop("Protected files changed without maintainer approval")

  if exceedsDiffLimits(result.diff):
    moveLabel(issueNumber, remove="agent-working", add="agent-blocked")
    stop("Diff too large")

  run("format")
  run("lint")
  run("typecheck")
  run("test")
  run("build")

  if anyCheckFails:
    moveLabel(issueNumber, remove="agent-working", add="agent-blocked")
    stop("Quality gates failed")

  push(branchName)
  openDraftPR(titleFromIssue(candidate), bodyIncludes("Closes #" + issueNumber))
  moveLabel(issueNumber, remove="agent-working", add="agent-pr-open")
```
