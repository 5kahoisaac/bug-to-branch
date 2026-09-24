import { TaskBoard } from "@/components/task-board";

const WORKFLOW_STEPS = [
  {
    title: "Capture feedback",
    body: "Use the floating BugDrop control to submit a bug, request, or question with browser context and optional screenshots.",
  },
  {
    title: "Open GitHub issue",
    body: "BugDrop sends your report directly to this repository so maintainers can triage in the same place code is reviewed.",
  },
  {
    title: "Ship with confidence",
    body: "Approved issues can be labeled agent-ready and moved into an audited pull-request workflow.",
  },
];

const VALUE_PILLS = [
  "Public issue history",
  "No custom intake backend",
  "GitHub-first collaboration",
  "Human-reviewed PRs",
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">BugDrop + GitHub workflow</p>
        <h1 id="hero-title">Turn user feedback into actionable GitHub work.</h1>
        <p className="hero-copy">
          Bug to Branch uses the real hosted BugDrop widget for this repository. Reports become
          public GitHub issues your team can triage, discuss, and schedule into implementation.
        </p>
        <div className="hero-actions">
          <a
            href="https://github.com/5kahoisaac/bug-to-branch"
            target="_blank"
            rel="noreferrer"
            className="button button-primary"
          >
            View repository
          </a>
          <a href="#bugdrop-cta" className="button button-secondary">
            How to send feedback
          </a>
        </div>
        <ul className="value-pills" aria-label="Key benefits">
          {VALUE_PILLS.map((pill) => (
            <li key={pill}>{pill}</li>
          ))}
        </ul>
      </section>

      <section className="workflow" aria-label="Workflow explanation">
        {WORKFLOW_STEPS.map((step, index) => (
          <article key={step.title}>
            <p className="step-index">0{index + 1}</p>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section id="bugdrop-cta" className="cta" aria-labelledby="cta-title">
        <h2 id="cta-title">Ready to report?</h2>
        <p>
          Click <strong>Send feedback</strong> in the bottom-right corner to open the official
          BugDrop widget for this repository.
        </p>
      </section>

      <TaskBoard />
    </main>
  );
}
