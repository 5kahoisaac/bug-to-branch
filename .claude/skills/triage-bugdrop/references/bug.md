# Bug (`bug` label): investigate and resolve

1. Skip if the issue has a `triage-bugdrop:fix` or `triage-bugdrop:blocked` comment with no newer human comment after it.
2. `gh issue edit <N> --add-label agent-working`
3. Find the code: take the **Page** URL from System Info, strip the `/bug-to-branch` base path, and map it to `app/<path>/page.tsx` (e.g. `/broken/checkout/` → `app/broken/checkout/page.tsx`). If there's a screenshot, download it to the scratchpad and look at it.
4. Find the root cause. Reproduce it if you can (`npm run dev` and open the page) or trace it in code.
5. If the report is too vague or you can't find a cause: post a comment starting with `<!-- triage-bugdrop:blocked -->` that asks for the specific missing detail, then `gh issue edit <N> --remove-label agent-working --add-label agent-blocked`. Stop here for this issue.
6. Make the smallest fix that addresses the root cause, then follow **Shipping a code change** in `SKILL.md` with commit type `fix`.
7. Comment on the issue starting with `<!-- triage-bugdrop:fix -->`: the root cause in one or two sentences, plus the PR link.
