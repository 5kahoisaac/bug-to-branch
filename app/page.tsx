import Link from "next/link";

import { ReportFeedbackButton } from "@/components/report-feedback-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REPO_URL = "https://github.com/5kahoisaac/bug-to-branch";
const ISSUES_URL = `${REPO_URL}/issues`;

type Status = "Live" | "Local";

const TEST_AREAS: { title: string; body: string; status: Status }[] = [
  {
    title: "BugDrop widget",
    body: "The hosted widget loads on every page and collects a category, title, description, and optional screenshot.",
    status: "Live",
  },
  {
    title: "Report → GitHub issue",
    body: "Each report opens a public issue in this repo, labeled bugdrop plus bug, enhancement, or question, with browser info attached.",
    status: "Live",
  },
  {
    title: "Triage agent",
    body: "A Claude Code skill (/triage-bugdrop) reads new issues and handles them by type. It runs on a maintainer’s machine about every 30 minutes, only while that session is open.",
    status: "Local",
  },
];

const STATUS_STYLES: Record<Status, string> = {
  Live: "bg-emerald-400",
  Local: "bg-amber-400",
};

const REPORT_TYPES = [
  {
    category: "Bug",
    label: "bug",
    body: "The agent finds the root cause, fixes it in a draft pull request, and links the PR on your issue. A maintainer reviews before anything is merged.",
  },
  {
    category: "Feature",
    label: "enhancement",
    body: "The agent posts a plan as a comment and waits. Work starts only after a maintainer replies “ok”; any other reply keeps it pending.",
  },
  {
    category: "Question",
    label: "question",
    body: "The agent replies with an answer based on this repo’s README, docs, and code, or says plainly if the repo can’t answer it.",
  },
];

const BROKEN_PAGES = [
  { href: "/broken/checkout/", title: "Checkout", body: "Cart, promo code, and an order button." },
  { href: "/broken/dashboard/", title: "Dashboard", body: "Stats, a team card, and a reports table." },
  { href: "/broken/settings/", title: "Settings", body: "A profile form with a notifications toggle." },
];

const HOW_TO_TEST = [
  "Open a broken page below, spot something wrong, and click the Feedback button.",
  "Pick Bug, Feature, or Question, write a short title, and add a screenshot if you like.",
  "Find your issue in the Issues tab. If the triage loop is running, expect a reply within about 30 minutes.",
];

function BranchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="8" r="2.5" />
      <path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-200px] -z-10 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BranchIcon className="size-4" />
          </span>
          Bug to Branch
        </a>
        <Button asChild variant="ghost" size="sm">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </Button>
      </header>

      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        <section className="pb-16 pt-14 sm:pt-20">
          <Badge variant="outline" className="mb-6 gap-2 border-border bg-secondary/60 px-3 py-1 font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Test sandbox · not a product
          </Badge>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Testing BugDrop with GitHub Issues
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            This page exists to try BugDrop end to end: send a report, see it land as a GitHub
            issue in this repo, and let a local Claude Code agent triage it. Test reports are
            welcome.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ReportFeedbackButton>Send a test report</ReportFeedbackButton>
            <Button asChild variant="outline" size="lg">
              <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                View issues
              </a>
            </Button>
          </div>
        </section>

        <section className="border-t py-14" aria-labelledby="status-title">
          <h2 id="status-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            What’s being tested
          </h2>
          <ul className="mt-6 divide-y overflow-hidden rounded-xl border bg-card/50">
            {TEST_AREAS.map((area) => (
              <li key={area.title} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div>
                  <h3 className="font-medium">{area.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className={`size-1.5 rounded-full ${STATUS_STYLES[area.status]}`} />
                  {area.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t py-14" aria-labelledby="types-title">
          <h2 id="types-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            What happens to your report
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {REPORT_TYPES.map((type) => (
              <li key={type.label} className="rounded-xl border bg-card/50 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">{type.category}</h3>
                  <code className="rounded-md border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {type.label}
                  </code>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{type.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t py-14" aria-labelledby="howto-title">
          <h2 id="howto-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            How to test it
          </h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {HOW_TO_TEST.map((step, index) => (
              <li key={step} className="rounded-xl border bg-card/50 p-5">
                <p className="font-mono text-xs text-primary">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t py-14" aria-labelledby="broken-title">
          <h2 id="broken-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            Broken pages to report
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each page has several deliberate UI bugs. Report whatever you find.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {BROKEN_PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="block h-full rounded-xl border bg-card/50 p-5 transition-colors hover:border-primary/50 hover:bg-card">
                  <p className="font-medium">{page.title} →</p>
                  <p className="mt-1 text-sm text-muted-foreground">{page.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5 sm:p-6" aria-labelledby="notes-title">
          <h2 id="notes-title" className="text-sm font-semibold">Before you submit</h2>
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>Every report becomes a public GitHub issue, so leave out anything private.</li>
            <li>Screenshots are stored on the repo’s <code className="font-mono text-xs text-foreground">bugdrop-screenshots</code> branch.</li>
            <li>Test issues may be closed or deleted at any time.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 text-xs text-muted-foreground sm:px-8">
          <span>Bug to Branch · experiment</span>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            5kahoisaac/bug-to-branch
          </a>
        </div>
      </footer>
    </div>
  );
}
