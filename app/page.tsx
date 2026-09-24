import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="gap-0 border-border/80 bg-card/95">
        <CardContent className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              BugDrop + GitHub workflow
            </p>
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Turn user feedback into actionable GitHub work.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              Bug to Branch uses the real hosted BugDrop widget for this repository. Reports become
              public GitHub issues your team can triage, discuss, and schedule into implementation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <a href="https://github.com/5kahoisaac/bug-to-branch" target="_blank" rel="noreferrer">
                View repository
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7">
              <a href="#bugdrop-cta">How to send feedback</a>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-2.5" aria-label="Key benefits">
            {VALUE_PILLS.map((pill) => (
              <li key={pill}>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {pill}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Workflow explanation"
      >
        {WORKFLOW_STEPS.map((step, index) => (
          <Card key={step.title} className="gap-0 border-border/80 bg-card/95">
            <CardContent className="space-y-3 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary">0{index + 1}</p>
              <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card id="bugdrop-cta" className="gap-0 border-primary/25 bg-primary/[0.06]" aria-labelledby="cta-title">
        <CardContent className="space-y-2 px-6 py-6">
          <h2 id="cta-title" className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to report?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Click <strong>BugDrop feedback</strong> in the bottom-right corner to open the official
            BugDrop widget for this repository.
          </p>
        </CardContent>
      </Card>

      <TaskBoard />
    </main>
  );
}
