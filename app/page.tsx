import { TaskBoard } from "@/components/task-board";

const WORKFLOW_STEPS = [
  {
    title: "Report",
    body: "Submit a bug, feature request, or question with BugDrop. Context and screenshots are attached to a GitHub Issue.",
  },
  {
    title: "Review",
    body: "A maintainer triages the issue and applies agent-ready once the request is clear and approved.",
  },
  {
    title: "Pull Request",
    body: "A future scheduled coding-agent workflow picks one approved issue, runs checks, and opens a draft pull request.",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="tagline">Feedback in. Pull requests out.</p>
        <h1>Bug to Branch</h1>
        <p>
          This experiment shows a GitHub-native path from public feedback to human-reviewed code
          proposals.
        </p>
        <p className="notice">
          Submitted feedback becomes a public GitHub Issue in this repository.
        </p>
        <a
          href="https://github.com/5kahoisaac/bug-to-branch"
          target="_blank"
          rel="noreferrer"
          className="repo-link"
        >
          View repository
        </a>
      </section>

      <section className="workflow" aria-label="Workflow explanation">
        {WORKFLOW_STEPS.map((step) => (
          <article key={step.title}>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <TaskBoard />
    </main>
  );
}
