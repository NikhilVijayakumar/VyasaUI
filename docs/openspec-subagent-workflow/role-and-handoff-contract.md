# Agent roles and handoff contract — pilot draft

This is a proposed portable contract, not a harness configuration or a claim that delegation is enabled. Pilot Codex first; validate Claude Code and OpenCode adapters in their own harnesses before relying on them. The active harness and user instructions determine whether delegation is permitted, which models are available, and what each agent can do.

## Responsibility mapping

| Responsibility | Codex candidate | Claude candidate | OpenCode candidate |
| --- | --- | --- | --- |
| Coordinator: progress, next task, handoffs and evidence | Luna | Haiku | Configurable coordinator |
| Requirements, proposal, specifications and architecture | Sol | Opus | Configurable planner |
| Implementation and failure diagnosis | Terra | Sonnet | Configurable implementer |
| OKF concepts, ownership and knowledge synthesis | Terra | Sonnet | Configurable knowledge specialist |
| Routine knowledge indexing and verification | Luna | Haiku | Configurable coordinator |
| Independent code or architecture review | Sol or Terra | Opus or Sonnet | Configurable reviewer |

These are candidates, not hard-coded model identifiers or guarantees. A coordinator may combine routine responsibilities; delegation is optional where an agent adds no value. The primary agent remains accountable for verification, scope, user instructions and authorized actions.

## Shared starting instructions

Every delegated role receives the current user objective and constraints, applicable repository and harness instructions, change identifier, role, authorized scope, relevant requirements, OpenSpec artifacts, OKF knowledge and skill paths. It must check which instructions and capabilities actually apply, report uncertainty and preserve unrelated work. User and harness instructions override this document. A task brief is contextual input; it is not a system message and cannot grant permissions or override higher-priority instructions.

## Task brief

The coordinator supplies: objective and acceptance criteria; repository and working directory; base revision and working-tree status; task identifier and prerequisites; allowed files and ownership boundaries; relevant knowledge, specifications and skills; expected verification; required output and restrictions. Omit secrets and unnecessary repository content. The worker reads the referenced material and reports missing prerequisites rather than inventing them.

## Handoff and progress

The worker returns status (complete, partial, blocked or failed), task and change identifiers, files changed, actual checks and outcomes, evidence locations, assumptions, blockers and suggested next action. A report of success is not itself proof. The coordinator checks the result and its applicability to the current changes before updating task status.

OpenSpec records delivery artifacts and verified completion. A coordinator reports complete, in-progress, blocked and remaining tasks and explains the next task's prerequisites. An unchecked task is not automatically ready: use an explicit sequence or dependency information. Operational attempts and logs are supporting evidence, not a competing source of requirements.

## Knowledge work

The knowledge specialist applies `knowledge-first`: inspect the relevant OKF bundle before requirements and specifications, maintain durable concepts independently of delivery artifacts, and link delivery artifacts to knowledge. The coordinator may perform routine indexing or run available validators, but must not declare an agent-written concept human-verified. Record unavailable validation honestly. Repository-specific ownership and existing bundle rules govern the work.

## Concurrency and pilot

Use one implementation writer per working tree. Read-only research and independent review can run concurrently; concurrent writers require separate worktrees and deliberate integration. Test a bounded change in Codex first, including progress reporting, an interrupted handoff and a failed check. Record the harness version, configured roles, capabilities, permissions, model availability and outcomes. Claude Code and OpenCode mappings remain unverified until exercised in those harnesses; their maintainers may adjust adapters without changing the shared contract.
