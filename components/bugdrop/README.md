# BugDrop integration

Drop-in [BugDrop](https://bugdrop.dev) setup for a Next.js App Router + Tailwind v4 project. Visitors pick a type, a reporter, and optional grouping labels in a small panel, then BugDrop's modal collects the title, description, and screenshot and opens a GitHub issue.

## Reuse in another project

1. Copy this folder to `components/bugdrop/`.
2. Edit `config.ts`: `BUGDROP_REPO`, `REPORTERS`, `GROUP_LABELS`, and `BUGDROP_THEME` colors.
3. Render it once at the end of `<body>` in `app/layout.tsx`:

   ```tsx
   import { BugDrop } from "@/components/bugdrop";

   <body>
     {children}
     <BugDrop />
   </body>
   ```

4. Optional in-page trigger: `<FeedbackLink className="…">Send feedback</FeedbackLink>`, or wrap it in your button component (`<Button asChild>`).
5. Install the BugDrop GitHub App on the target repo.

Assumes shadcn-style Tailwind color tokens (`bg-card`, `bg-primary`, `text-muted-foreground`, `border-input`, `ring-ring`, …). No other dependencies.

## Files

| File | What it does |
|---|---|
| `config.ts` | All project-specific values. The only file you should need to edit |
| `bugdrop.tsx` | `<BugDrop />`: loads the pinned widget script (its own button hidden) and mounts the client parts |
| `client.tsx` | Installs the theme and description patches, renders the launcher |
| `feedback-launcher.tsx` | Floating Feedback button and panel; opens the BugDrop flow for the chosen type |
| `flows.ts` | BugDrop custom-flow configs (one per type) and the `open()` context builder |
| `feedback-link.tsx` | In-page link that opens the panel, falling back to GitHub's new-issue form |
| `theme.ts` | Patches BugDrop's Shadow DOM so its modals use `BUGDROP_THEME` |
| `description-fix.ts` | Removes a duplicate `## Description` heading from flow reports (see below) |
| `icons.tsx` | Inline SVG icons |

## Issue format

```
## Description
<what the visitor wrote>

## Reporter
Jane Smith

## Labels
copies, styling
```

followed by BugDrop's screenshot and System Info. `## Labels` is omitted when none are picked.

## Workarounds and limits (BugDrop v1.56.4)

- **One flow per type.** A flow's bug/feature/question classification is fixed, so the panel picks the type and opens the matching flow.
- **Reporter and labels come from the panel.** BugDrop flows have no dropdown display and no released multi-select, so these are chosen in our panel and passed as `open({ context })`.
- **Labels are text, not GitHub labels.** BugDrop can't add per-report labels. Something else has to read `## Labels` and apply them (here, the `/triage-bugdrop` skill). Only apply names from your allowlist; issue text is untrusted.
- **Duplicate Description heading.** BugDrop's server always writes `## Description` before a flow's output, and flow sections always have headings. `description-fix.ts` wraps `window.fetch` for POSTs to BugDrop's `/api/feedback` only and strips our leading heading. If BugDrop changes that request, the patch does nothing and the heading shows twice.
- **Theme patches use BugDrop internals** (`#bugdrop-host`, `[data-bugdrop-flow]`, `--bdv-*` variables). If they change, the modals fall back to BugDrop's own dark theme.
- **No Browser/OS rows.** Flow reports carry the user agent but BugDrop's server only prints Browser/OS rows for its default form.
