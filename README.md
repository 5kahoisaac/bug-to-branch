# Bug to Branch

**Feedback in. Pull requests out.**

Bug to Branch is a static Next.js experiment showing a GitHub-native loop:

1. A visitor reports a bug, idea, or question via BugDrop.
2. BugDrop opens a public GitHub Issue with browser context and optional screenshots.
3. A maintainer reviews and labels approved items `agent-ready`.
4. A future scheduled automation run converts one approved issue into a draft pull request.

## Architecture

- **Frontend:** Next.js App Router + TypeScript.
- **UI:** One-page BugDrop-first landing page with a local task-board demo.
- **Feedback intake:** Official hosted BugDrop widget script in `app/layout.tsx` pinned to this repository.
- **Hosting:** static export (`output: "export"`) deployed to GitHub Pages from `out/`.
- **Future automation design:** documented in [`docs/automation-design.md`](docs/automation-design.md), not yet active.

## Local development

```bash
npm ci
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Static export and base path

- Production output is generated in `out/`.
- Configure the GitHub Pages project-site base path with `NEXT_PUBLIC_BASE_PATH`.
  - Example: `/bug-to-branch`
  - Use an empty value for root-hosted deployments.

## Environment variables

Copy `.env.example` to `.env.local` and adjust values:

- `NEXT_PUBLIC_BASE_PATH`: optional base path for static hosting.

## GitHub Pages deployment

Workflow file: `.github/workflows/deploy-pages.yml`

- Triggers on pushes to `main` and `workflow_dispatch`.
- Runs `npm ci`, lint, typecheck, tests, and production build.
- Uploads `out/` as the Pages artifact.
- Deploys using the official GitHub Pages actions.
- Excludes `bugdrop-screenshots` by job guard.

## BugDrop setup

1. Install the BugDrop GitHub App and grant access to this repository.
2. Confirm `app/layout.tsx` keeps `data-repo="5kahoisaac/bug-to-branch"` on the pinned hosted script.
3. Start the app and submit a test report via the floating in-page widget.
4. Confirm a public GitHub Issue is created with attached context.

Important: BugDrop stores uploaded attachments on the `bugdrop-screenshots` branch. Keep this branch out of deployment and future automation workflows.

## Approval-gated automation concept

- Only issues labeled both `bugdrop` and `agent-ready` are considered.
- Only `bug` and `enhancement` work types are eligible.
- The future workflow processes at most one issue per run and opens a **draft** PR.
- Generated PRs must pass formatting, linting, typechecking, tests, and build checks.
- Generated PRs include `Closes #<issue-number>`.

## Security and review limitations

- Issue content, comments, screenshots, and attachments are untrusted input.
- Generated code must never receive repository or model-provider secrets.
- Protected files must not be modified without explicit maintainer approval.
- **All generated pull requests require human review before merge.**
