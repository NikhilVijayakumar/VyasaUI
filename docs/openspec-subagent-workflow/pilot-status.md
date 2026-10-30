# Agent pilot status

The repository-local role files define coordinator, planner, implementer, knowledge and reviewer for Codex, Claude Code and OpenCode. The common instructions and task handoff are in `role-and-handoff-contract.md`. Codex registers roles in `.codex/config.toml` and loads role layers from `.codex/agents/`. Claude Code uses `.claude/agents/`; OpenCode definitions are in `.opencode/agents/` and inherit the configured model. `install-pilot.py` generates all 16 files and rewrites only files whose content changed; run it after editing the role registry. These definitions cannot override harness or user instructions, authorize actions, or guarantee delegation.

Verified on 2026-10-31:

- Codex CLI 0.165.0 loads the project `.codex/config.toml` (`--strict-config` rejects an unknown section there) and parses `.codex/agents/*.toml` role files at session start; an unknown field in a role file produces `Ignoring malformed agent role definition` and the role is skipped. `sandbox_mode` and `approval_policy` are accepted role fields. A live delegation could not be run: the account is over its usage limit, so `gpt-6-luna` and `gpt-6.1-sol` availability is still unverified; the account's configured model is `gpt-6.1-terra`.
- OpenCode 2.1.2 discovers project agents and delegates. A `vyasa-coordinator` run reported the correct task counts (`9` checked, `8` unchecked), the correct unchecked task IDs, the caveat that task order is not a recorded dependency graph, and a contract-shaped handoff.
- Claude Code 2.1.292 is installed; its project agents have not been execution-tested.

Reviewer isolation is declared, not proven. OpenCode denies edit, Claude Code allows only `Read, Grep, Glob, Bash`, and the Codex reviewer role runs with `sandbox_mode = "read-only"`. Shell access remains because a review needs `git diff`, and a shell can still write files; test the denial before relying on it.

Before relying on the pilot, run a live Codex delegation when quota permits, a Claude Code delegation, and a reviewer denial test. The Vyasa backend repository has no equivalent role files yet. Role files exist only on branches that contain the pilot commit; a branch cut before it has none, and switching to it removes them from the working tree.

Use a fresh trusted session to verify registration, model availability, instruction loading, real file access, an interrupted handoff, failing-check recovery and progress accuracy. Preserve the staged workflow documents and unrelated changes.
