Yes. You can build exactly this kind of multi-agent workflow on top of your existing OpenSpec custom schemas, using specialized agents for planning, implementation, testing, Git management, and OpenSpec administration.

Both Codex and Claude Code support custom subagents with different instructions and model assignments. OpenSpec can remain the common specification and workflow layer.

The important distinction is that OpenSpec defines what needs to happen, while Codex or Claude Code decides which agent performs the work.

I would recommend extending your existing shared OpenSpec framework rather than changing or replacing the schemas you've already developed.

## 1. Recommended architecture

User request / requirement

Starts an OpenSpec change

Workflow Orchestrator

Reads OpenSpec state, selects agents, manages dependencies and handoffs

Planner

Sol / Opus

Requirements, specs, design

Implementer

Terra / Sonnet

Write and fix code

Coordinator

Luna / Haiku

Git, tracking, tests

Shared project state

OpenSpec artifacts · Task checklist · Git branch · Tests · Verification evidence

This architecture provides several advantages: each agent has a smaller responsibility, expensive models are used where reasoning matters most, and cheap models handle predictable operations. It also keeps the implementation context separate from planning and test logs.

## 2. How I would assign responsibilities

| Stage                   | Codex model  | Claude model   | Responsibility                             |
| ----------------------- | ------------ | -------------- | ------------------------------------------ |
| Requirement analysis    | Sol          | Opus           | Clarify complex requirements and decisions |
| Proposal, specs, design | Sol          | Opus           | Produce OpenSpec artifacts                 |
| Task slicing            | Sol or Terra | Sonnet or Opus | Create independently verifiable tasks      |
| Git branch setup        | Luna         | Haiku          | Check branch policy, create branch         |
| Code implementation     | Terra        | Sonnet         | Implement a bounded task                   |
| Unit-test generation    | Terra        | Sonnet         | Write meaningful tests                     |
| Test execution          | Luna         | Haiku          | Run commands, collect results              |
| Failure diagnosis       | Terra        | Sonnet         | Investigate and fix failures               |
| Architecture review     | Sol          | Opus           | Review high-risk changes                   |
| OpenSpec updates        | Luna         | Haiku          | Update task checkboxes and records         |
| Final verification      | Terra / Sol  | Sonnet / Opus  | Verify behavior against specifications     |
| PR preparation          | Luna         | Haiku          | Prepare summary and evidence               |
| Archive                 | Luna         | Haiku          | Archive after verification and approval    |

These are recommended assignments, not mandatory ones.

One important adjustment to your proposal: Luna should execute and report tests, but Terra should own implementation corrections. Luna should not attempt complex test-failure repairs simply because it is the agent running the tests.

For the more demanding architectural or security reviews, use Sol or Opus as needed. There is no reason to invoke them on every small implementation task.

## 3. How the complete workflow should operate

I suggest implementing a task-level orchestration loop, not simply handing an entire feature to Terra and asking Luna to test it at the end.

1. Sol / Opus — Planning

   Review requirements, generate proposal, Gherkin specs, technical design and ADRs as needed. Break the design into small tasks with acceptance criteria.
2. Luna / Haiku — Preparation

   Check OpenSpec state, identify the next ready task, verify prerequisites, and create or check the appropriate `feature/<id>-<desc>` branch.
3. Terra / Sonnet — Implementation

   Implement exactly the assigned task. Produce the associated tests and a concise summary of changed files.
4. Luna / Haiku — Validation

   Run applicable unit tests, linting, type checks, integration tests or Playwright tests. Capture exit codes and failure evidence.
5. Terra / Sonnet — Repair (when required)

   Analyze failures, repair the implementation, and return the change for another validation cycle. Escalate repeated or design-level failures to Sol/Opus.
6. Luna / Haiku — Task closure

   Check acceptance criteria and evidence. Mark the OpenSpec task complete only when the required checks have passed.
7. Orchestrator — Continue or finish

   Select the next unblocked task, or perform final verification, prepare the PR and request approval for archiving.

The loop is:

For example, suppose OpenSpec has produced ten tasks. Luna picks task 1.1, Terra implements it, Luna runs the checks, and Terra repairs any failures. Only then does the workflow advance to the next task.

This is better than implementing all ten tasks before discovering that the first three introduced architectural or behavioral problems.

## 4. Where each piece belongs

I would not put all the agent configuration into `schema.yaml`.

| Component                          | Responsibility                                                     |
| ---------------------------------- | ------------------------------------------------------------------ |
| `openspec/schemas/.../schema.yaml` | Artifact definitions and dependencies                              |
| `openspec/config.yaml`             | Shared context, artifact rules and operation guidance              |
| `AGENTS.md`                        | Common Codex project instructions                                  |
| `CLAUDE.md`                        | Common Claude Code instructions                                    |
| Shared agent contract              | Role definitions and task handoff rules                            |
| `.codex/agents/*.toml`             | Codex-specific agent configurations                                |
| `.claude/agents/*.md`              | Claude-specific agent configurations                               |
| Shared skills                      | Reusable OpenSpec, Git, testing and review procedures              |
| Orchestrator                       | Determine next action, delegate, verify results and handle retries |

OpenSpec's documentation confirms that schemas govern artifacts, their dependencies and instructions; project configuration governs shared rules and operations. Neither is a built-in multi-model scheduler.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://openspec.dev\&sz=32)

OpenSpec+2



### Proposed shared repository layout

```

shared-workflow/
├── openspec/
│   ├── config.yaml
│   └── schemas/
│       ├── intent-driven/
│       ├── frontend/
│       ├── backend/
│       └── qa/
│
├── agents/
│   ├── contracts/
│   │   ├── planner.md
│   │   ├── implementer.md
│   │   ├── coordinator.md
│   │   └── reviewer.md
│   └── workflow-policy.yaml
│
├── .codex/
│   └── agents/
│       ├── planner.toml
│       ├── implementer.toml
│       ├── coordinator.toml
│       └── reviewer.toml
│
├── .claude/
│   └── agents/
│       ├── planner.md
│       ├── implementer.md
│       ├── coordinator.md
│       └── reviewer.md
│
├── .agents/
│   └── skills/
│       ├── openspec-next-task/
│       ├── openspec-task-execution/
│       ├── test-verification/
│       └── git-workflow/
│
├── AGENTS.md
└── CLAUDE.md

```

The `agents/contracts/` and `workflow-policy.yaml` pieces are my suggested portable conventions, not native OpenSpec features.

Your existing shared framework can generate these integration files when a new project is initialized, alongside the relevant frontend, backend or QA skills.

## 5. Codex implementation

Codex supports project-scoped custom agents under `.codex/agents/`, with individual model assignments and developer instructions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://learn.chatgpt.com\&sz=32)

ChatGPT Learn+1



For example, create `.codex/agents/coordinator.toml`:

```

name = "coordinator"
description = "Manage OpenSpec task selection, Git workflow, test execution and task completion."

model = "gpt-6-luna"
model_reasoning_effort = "medium"

developer_instructions = """
You are the OpenSpec workflow coordinator.

Responsibilities:
- Read the current OpenSpec change and task state.
- Select the next ready task using dependencies.
- Verify the correct Git branch.
- Delegate implementation to an implementer.
- Run prescribed tests and verification commands.
- Collect failure evidence.
- Return implementation failures to the implementer.
- Update tasks.md after verification succeeds.
- Report blockers and next actions.

Rules:
- Never implement business logic.
- Never mark failed or unverified tasks complete.
- Never silently modify specifications.
- Never merge, push or archive without authorization.
- Escalate repeated failures or design conflicts.
"""

```

Create `.codex/agents/implementer.toml`:

```

name = "implementer"
description = "Implement bounded OpenSpec tasks and repair implementation defects."

# Replace with an exact model ID available in your Codex client.
# model = "YOUR_IMPLEMENTATION_MODEL"

developer_instructions = """
You are an implementation specialist.

Read the assigned OpenSpec task, relevant specs,
design and project conventions.

Implement only the assigned task.

Write or update tests for changed behavior.

Do not modify requirements or acceptance criteria
without escalating the conflict.

Return:
- Files changed
- Implementation summary
- Tests added
- Checks performed
- Remaining risks
"""

```

A note on model names: the current Codex documentation explicitly describes `gpt-6.1-sol` and `gpt-6-luna`. I haven't verified a Codex model identifier called Terra, so the implementer example deliberately leaves its model configurable. You can select the actual implementation model available in your account.

Also, Codex subagents use models available through the configured Codex provider. You cannot simply assign Claude Sonnet or Opus as their `model` values. Mixing providers would require a separate external orchestration layer or supported provider integration.

## 6. Claude Code implementation

Claude Code also supports project subagents, defined as Markdown files under `.claude/agents/`, with YAML frontmatter specifying the model and role.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://academy.claude.com\&sz=32)

Claude Academy



For example, `.claude/agents/coordinator.md`:

```

---
name: coordinator
description: Coordinates OpenSpec tasks, Git and testing.
model: haiku
---

You are the OpenSpec workflow coordinator.

Follow the shared coordinator contract.

Read OpenSpec artifacts before selecting tasks.
Delegate implementation to the implementer.
Run verification and record evidence.
Return failures to the implementer.
Close tasks only after successful verification.
Never approve your own unverified work.

```

And `.claude/agents/implementer.md`:

```

---
name: implementer
description: Implements and repairs bounded OpenSpec tasks.
model: sonnet
---

You are the OpenSpec implementation specialist.

Implement only the assigned task.
Follow the specs, design and acceptance criteria.
Write or update relevant tests.
Return a concise implementation report.
Do not mark the task complete yourself.

```

The planner can similarly use `model: opus`.

This gives you essentially the same logical workflow in both coding tools, without duplicating your complete OpenSpec specification.

## 7. How do we monitor the pipeline?

One important detail: I would make monitoring deterministic wherever possible, rather than repeatedly asking Luna or Haiku to reason about the repository.

Your coordinator can read OpenSpec's structured commands, such as:

```

openspec list --json
openspec status --change <change-id> --json
openspec validate <change-id> --strict
openspec instructions apply --change <change-id>

```

OpenSpec supports structured status and instruction retrieval, making it possible to use command output for workflow decisions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://openspec.dev\&sz=32)

OpenSpec



Then the coordinator applies simple conditions:

| Condition                | Action                           |
| ------------------------ | -------------------------------- |
| No remaining tasks       | Start final verification         |
| Ready task found         | Delegate to implementer          |
| Implementation completed | Run verification                 |
| Verification failed      | Request repair                   |
| Repeated failures        | Escalate to planner/reviewer     |
| Verification passed      | Update task status               |
| All checks passed        | Prepare PR and completion report |

A Python script could eventually handle much of this without spending model tokens on routine state transitions.

For safety and reliability, keep a maximum retry count, require actual command results before closing tasks, and avoid multiple agents editing the same files simultaneously. Separate Git worktrees are useful when genuinely independent tasks can run in parallel.

## 8. What I would implement first

Given your existing intent-driven OpenSpec framework with separate frontend, backend and QA schemas, I would implement this in two phases.

Phase 1 — Native subagent orchestration

Keep the current schemas unchanged. Introduce four shared roles: Planner, Implementer, Coordinator and Reviewer. Add Codex/Claude-specific agent configurations, shared handoff contracts and an orchestration skill that the main coding agent follows.

Test the workflow on a small OpenSpec change with three to five tasks, including a deliberately failing test to ensure the repair cycle actually works.

Phase 2 — Deterministic workflow controller

Once Phase 1 is reliable, introduce a small Python orchestration layer that tracks task state, invokes supported agent interfaces, manages retries and persists execution evidence. This would make the behavior more consistent across Codex, Claude Code and potentially OpenCode.

The first phase is enough to validate the idea; you don't need to build an entire agent framework immediately.

My recommendation: Make agents interchangeable by responsibility, rather than tying the workflow to Sol, Luna, Terra, Opus, Sonnet or Haiku. That way, if model quality, availability or pricing changes, you only update the agent configuration—not your OpenSpec schemas or execution contracts.

The one architectural decision I would make now is to keep the Coordinator as the owner of workflow state, while the Planner owns design decisions, the Implementer owns code, and the Reviewer independently evaluates correctness. That separation will make your existing OpenSpec framework substantially easier to automate and maintain.