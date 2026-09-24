# Feature (`enhancement` label): plan, then wait for "ok"

Find the latest comment containing `triage-bugdrop:plan`.

## No plan yet

1. Read the relevant code and write a short plan: goal, approach, files to change, what's out of scope, and risks or open questions.
2. Post it as a comment starting with `<!-- triage-bugdrop:plan -->` and ending with:
   > Reply **ok** to start. Any other reply keeps this pending.
3. `gh issue edit <N> --add-label awaiting-approval`, then stop. Don't write code.

## Plan already posted

Look only at comments posted *after* the latest plan comment that:
- have no `triage-bugdrop:` marker, and
- come from `OWNER`, `MEMBER`, or `COLLABORATOR` (`authorAssociation`).

Take the most recent one, trimmed and lowercased:

- **`ok`, `ok to go`, `go`, `go ahead`, `approved`, or `lgtm`:**
  1. `gh issue edit <N> --remove-label awaiting-approval --add-label agent-working`
  2. Implement exactly the posted plan, nothing more.
  3. Follow **Shipping a code change** in `SKILL.md` with commit type `feat`.
  4. Comment on the issue starting with `<!-- triage-bugdrop:fix -->`: what was built, plus the PR link.
- **Anything else, or no reply:** keep pending. Change nothing and report it as "awaiting approval" in the summary.
