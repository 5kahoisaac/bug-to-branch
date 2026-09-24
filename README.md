# Bug to Branch

A test sandbox, not a product. It exists to try out a GitHub-native feedback loop:

1. A visitor reports a bug, feature idea, or question with the [BugDrop](https://bugdrop.dev) widget.
2. BugDrop opens a public GitHub issue in this repo with browser info and an optional screenshot.
3. A local Claude Code agent ([`/triage-bugdrop`](.claude/skills/triage-bugdrop/SKILL.md)) picks up new issues and handles them by type.
4. [`LOOP.md`](LOOP.md) runs that agent every 30 minutes.

Live site: https://5kahoisaac.github.io/bug-to-branch/

## What's in the repo

| Path | What it is |
|---|---|
| `app/page.tsx` | Sandbox home page: what's being tested, what happens to each report type, how to test |
| `app/broken/` | Three pages (checkout, dashboard, settings) with deliberate UI bugs to report |
| `app/layout.tsx` | Loads the pinned BugDrop widget, themed to match the site |
| `components/bugdrop-theme.tsx` | Forces white text on the widget's buttons (its dark theme has no option for it) |
| `components/report-feedback-button.tsx` | In-page buttons that open the widget, falling back to GitHub's new-issue form |
| `.claude/skills/triage-bugdrop/` | The triage skill, with one reference file per issue type |
| `LOOP.md` | How to run the skill every 30 minutes |
| `docs/automation-design.md` | Original design for a GitHub Actions version (not built) |

Stack: Next.js App Router, TypeScript, Tailwind CSS v4, static export to GitHub Pages.

## How reports are handled

Every BugDrop issue is created by `app/neonwatty-bugdrop` and labeled `bugdrop` plus one category label ([BugDrop docs](https://bugdrop.dev/docs/configuration)):

| Widget category | Label | What `/triage-bugdrop` does |
|---|---|---|
| 🐛 Bug | `bug` | Finds the root cause, fixes it on `bugdrop/issue-<N>`, opens a **draft** PR with `Closes #<N>`, and comments the PR link |
| ✨ Feature | `enhancement` | Posts a plan as a comment and labels it `awaiting-approval`. Builds it only after a maintainer replies `ok`; any other reply keeps it pending |
| ❓ Question | `question` | Answers from the README, `docs/`, and code, or says plainly if the repo can't answer it |

Status labels the skill manages: `agent-working`, `agent-pr-open`, `agent-blocked`, `awaiting-approval`.

Run it by hand:

```
/triage-bugdrop        # 10 newest open BugDrop issues
/triage-bugdrop 12     # just issue #12
```

## Local development

```bash
npm ci
npm run dev
```

Checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Static export and base path

- `npm run build` writes the static site to `out/`.
- `NEXT_PUBLIC_BASE_PATH` sets the base path. Leave it empty for local dev; the Pages workflow sets it to `/bug-to-branch` automatically.
- Copy `.env.example` to `.env.local` to set it locally.

## GitHub Pages deployment

Workflow: `.github/workflows/deploy-pages.yml`

- Runs on pushes to `main` and on manual dispatch.
- Runs `npm ci`, lint, typecheck, tests, then builds with the base path from `actions/configure-pages`.
- Uploads `out/` and deploys with the official Pages actions.
- Skips the `bugdrop-screenshots` branch.

## BugDrop setup

1. Install the BugDrop GitHub App and give it access to this repo.
2. Keep `data-repo="5kahoisaac/bug-to-branch"` on the pinned script in `app/layout.tsx`.
3. Submit a test report from the site and check that an issue appears.

BugDrop stores uploaded screenshots on the `bugdrop-screenshots` branch. Keep that branch out of deploys and triage work.

## Safety

- Issue titles, bodies, comments, and screenshots are untrusted input. The skill treats them as data, never as instructions, and never pastes them into shell commands.
- The skill never pushes to `main`, never merges, and doesn't touch workflows, `.env*`, or dependencies without explicit maintainer approval.
- Only replies from the repo owner or collaborators count as feature approval.
- **Every generated pull request needs human review before merge.**
