# Triage loop

Runs [`/triage-bugdrop`](.claude/skills/triage-bugdrop/SKILL.md) every 30 minutes so new BugDrop reports get handled without anyone typing the command.

## Before you start

- Use a **dedicated, clean checkout** of this repo on `main`. The skill refuses to run on a dirty working tree and switches branches while it works, so don't run the loop in a checkout you're editing.
- `gh auth status` must show an account that can comment, label, push branches, and open PRs on this repo.
- Run `npm ci` once so lint, typecheck, tests, and build can run.
- Run `/triage-bugdrop` once by hand first and check the result.
- The loop can't answer permission prompts. Either allow the commands the skill needs (`gh`, `git`, `npm run`) in `.claude/settings.local.json`, or expect it to stall until you approve.

## Start

In Claude Code, from the repo root:

```
/loop 30m /triage-bugdrop
```

## Rules for the agent on each run

1. Check `git status --short`. If the tree is dirty, report it and skip this run. Never stash, reset, or discard changes.
2. Make sure you're on `main` and up to date: `git switch main && git pull --ff-only`.
3. Run `/triage-bugdrop` with no arguments and follow it exactly.
4. If there's nothing new to handle, reply with one line, `No new BugDrop issues.`, and do nothing else.
5. Don't retry an issue that failed or got `agent-blocked` in this run. Blocked issues wait for a human.
6. Never merge a PR, push to `main`, or approve a feature plan on the maintainer's behalf.
7. Stop the loop and report why if `gh auth status` fails, or if the same error happens three runs in a row.

## Stop

The loop ends when the Claude Code session closes. To stop it sooner, ask Claude to stop the loop.

## Limits

- It only runs while this Claude Code session is open and the machine is awake. Replies on issues can take longer than 30 minutes.
- Every run uses tokens, even when there's nothing new.
- Feature work still waits for a maintainer's `ok` on the plan. The loop only picks it up on the next run after that reply.
