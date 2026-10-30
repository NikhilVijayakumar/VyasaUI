Yes, you can manage the same OpenSpec workflow in OpenCode. And there's good news: OpenCode already supports subagents, including custom agents with separate contexts and models. So you don't need to sacrifice the architecture we've discussed.

According to the current OpenCode documentation, it supports:

- Primary agents: Main agents that coordinate work, such as Build and Plan.
- Subagents: Specialized agents invoked by primary agents, automatically or explicitly.
- Fresh context: Subagents execute in separate child sessions.
- Custom models: Different agents can use models from different configured providers.
- Nested delegation: Configurable subagent depth.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

  OpenCode+2



## 1. All three tools can use the same architecture

| Capability                    | Codex                  | Claude Code            | OpenCode               |
| ----------------------------- | ---------------------- | ---------------------- | ---------------------- |
| Custom subagents              | Yes                    | Yes                    | Yes                    |
| Separate task context         | Yes                    | Yes                    | Yes                    |
| Different models per agent    | Yes                    | Yes                    | Yes                    |
| Agent-specific skills         | Yes                    | Yes                    | Yes                    |
| Specialized orchestrator      | Yes                    | Yes                    | Yes                    |
| Agent handoffs                | Yes                    | Yes                    | Yes                    |
| Persisted OpenSpec workflow   | Custom integration     | Custom integration     | Custom integration     |
| Fully automatic task pipeline | Requires orchestration | Requires orchestration | Requires orchestration |

The last two rows are important: native subagents give you delegation and context isolation, but do not automatically guarantee task selection, completion gates, recovery and restartability. Those remain responsibilities of your shared workflow.

## 2. How OpenCode would execute your workflow

OpenCode Primary Agent — Coordinator

Persistent lightweight context · OpenSpec task selection

Planner

Specs / design

Opus

Fresh context

Developer

Implementation

Sonnet

Fresh context

Tester

Validation

Haiku

Fresh context

Structured result returned to coordinator

Status · Changed files · Test evidence · Blockers

Next OpenSpec task

Launch a new specialist with fresh context

For example, OpenCode can use Opus for planning, Sonnet for implementation and Haiku for routine verification, provided those model IDs are available through the configured providers.

## 3. Configure custom OpenCode agents

OpenCode supports project-local Markdown agent definitions in `.opencode/agents/`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode



Your project can have:

```

.opencode/
└── agents/
    ├── coordinator.md
    ├── planner.md
    ├── react-developer.md
    ├── nestjs-developer.md
    ├── database-specialist.md
    ├── test-engineer.md
    └── reviewer.md

```

For example:

`.opencode/agents/nestjs-developer.md`

```

---
description: Implements NestJS backend OpenSpec tasks
mode: subagent
---

You are a NestJS implementation specialist.

Read the assigned OpenSpec task, its acceptance
criteria and relevant API contracts.

Apply the repository's backend skills.

Implement only the assigned task.
Create or update appropriate unit tests.

Do not modify unrelated components.

Return a concise structured report:
- Status
- Files changed
- Tests added
- Checks performed
- Blockers

```

A primary coordinator can delegate work to this agent without carrying its entire implementation dialogue in the parent context.

For model assignment, add the appropriate model field using the configuration syntax supported by your installed OpenCode version. The current documentation supports model-specific configurations and fresh child sessions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode



## 4. The improvement I recommend for your shared OpenSpec framework

Since you want to support Codex + Claude Code + OpenCode, don't make any one of those platforms the owner of your workflow.

Instead, separate the system into two layers.

Platform-independent workflow

OpenSpec schemas · Agent registry · Task dependencies · Skills · Verification · Persistent state

Codex

Adapter

Claude Code

Adapter

OpenCode

Adapter

Short-lived specialist agents

Fresh task context · Tool-specific execution · Structured handoff

The adapters would generate the correct agent configuration for each platform, map logical roles to available models and supply the same task execution contract.

Your task execution process remains unchanged even when you switch coding tools.

## 5. Do you need to develop a separate Python orchestrator immediately?

No. I would start with native subagents on all three platforms.

The native coordinator can:

1. Read OpenSpec task state.
2. Select the next ready task.
3. Delegate to an appropriate specialist.
4. Receive the result.
5. Delegate verification to another specialist.
6. Persist completion and diagnostic evidence.
7. Continue with the next task.

This gives you the context isolation you want without immediately building a large orchestration system.

However, for a long sequence of tasks, the coordinator's own context will still grow. If you eventually want hundreds of tasks executed reliably with automatic retries, session restarts, and recovery after interruption, a small deterministic Python controller becomes valuable.

It should be the long-term owner of workflow state—not another indefinitely running LLM session.

## 6. My recommendation for your implementation order

Start by adding OpenCode as a third adapter to your existing framework. Use one small OpenSpec change to validate the full cycle: task selection, fresh implementation subagent, fresh verification subagent, failure recovery and task completion.

Then test the same change structure with Codex and Claude Code to ensure your shared handoff contract works across all three.

Only after that should you introduce the Python execution controller.

Bottom line: OpenCode is not a blocker. It has native subagents, fresh child contexts and configurable model assignments. With your existing OpenSpec schemas and skills, you can build a consistent multi-agent development workflow across all three coding tools without maintaining three different specification systems.


Yes. OpenCode can use different free models for different subagents, just as Claude Code uses Opus, Sonnet and Haiku, or Codex uses Sol and Luna.

The difference is that OpenCode lets you mix models from different providers. For example, you can use Big Pickle for implementation, Nemotron for planning, and DeepSeek for reviewing or testing within the same OpenSpec workflow.

You do not need to select a model manually every time a subagent starts. OpenCode can assign a model to each custom agent, and that agent runs in its own child session with a fresh context.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode+1



## 1. My suggested model assignments

Here is how I would initially configure your OpenCode agents using the free models currently listed in its catalog.

| Workflow responsibility          | Claude equivalent | OpenCode model to try  |
| -------------------------------- | ----------------- | ---------------------- |
| Requirement analysis             | Opus              | Nemotron 3 Ultra       |
| Architecture and design          | Opus              | Nemotron 3 Ultra       |
| OpenSpec proposal/specs          | Opus / Sonnet     | Nemotron 3 Ultra       |
| React/NestJS implementation      | Sonnet            | Big Pickle             |
| Python/Unreal C++ implementation | Sonnet            | Big Pickle             |
| Test generation                  | Sonnet            | Big Pickle             |
| Independent code review          | Sonnet / Opus     | DeepSeek V4.1 Flash    |
| Git and OpenSpec coordination    | Haiku             | Nemotron 3.5 Lightning |
| Run tests and collect results    | Haiku             | Nemotron 3.5 Lightning |
| Failure analysis and repair      | Sonnet            | Big Pickle             |
| Repository exploration           | Haiku             | Nemotron 3.5 Lightning |

These are starting assignments for evaluation, not verified rankings. The optimal model depends on the task, and I would benchmark them against your existing projects before making them permanent.

Current free models worth testing

Big Pickle

Free\*

Primary coding candidate

Your preferred implementation model

Nemotron 3 Ultra

Free\*

Planning candidate

Complex specs and architecture

DeepSeek V4.1 Flash

Free\*

Review candidate

Independent checks and analysis

Nemotron 3.5 Lightning

Free\*

Coordinator candidate

Routine task operations

\*Listed as free in OpenCode's current catalog, generally for a limited period. Availability, limits and data-handling policies can vary by model.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://dev.opencode.ai\&sz=32)

OpenCode

One important thing about Big Pickle: OpenCode describes it as a stealth model, without publicly establishing its underlying model identity. So I would evaluate it based on actual coding and tool-calling performance rather than assuming it belongs to a known model family.

## 2. How OpenCode picks the model for each subagent

OpenCode has a simple rule:

If a subagent declares a model, it uses that model. Otherwise, it inherits the model of the parent session.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode



For example:

Primary orchestrator

Nemotron 3.5 Lightning

Planner

Nemotron Ultra

Own model

Implementer

Big Pickle

Own model

Coordinator helper

Nemotron Lightning

Inherited model

This means you can keep Big Pickle as your main coding model while using other free models for specialized work.

## 3. Example OpenCode configuration

For the current OpenCode V2 agent configuration, you could start with the following in your monorepo.

`opencode.jsonc`

```

{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "orchestrator",
  "subagent_depth": 1,
  "agents": {
    "orchestrator": {
      "mode": "primary",
      "model": "opencode/nemotron-3.5-lightning-free",
      "description": "Coordinates OpenSpec execution"
    },
    "planner": {
      "mode": "subagent",
      "model": "opencode/nemotron-3-ultra-free",
      "description": "Requirements, specs and design"
    },
    "implementer": {
      "mode": "subagent",
      "model": "opencode/big-pickle",
      "description": "Implements bounded OpenSpec tasks"
    },
    "reviewer": {
      "mode": "subagent",
      "model": "opencode/deepseek-v4.1-flash-free",
      "description": "Independent code and spec review"
    },
    "tester": {
      "mode": "subagent",
      "model": "opencode/nemotron-3.5-lightning-free",
      "description": "Runs tests and collects evidence"
    }
  }
}

```

This is a starter configuration rather than a complete security-hardened setup. You should add agent-specific prompts and tool permissions before automating Git writes, implementation or task closure.

The model names use OpenCode's `provider/model-id` convention. Check `/models` on your installed version, since available free models and identifiers can change.

## 4. What happens during an OpenSpec task?

Suppose OpenSpec has a task to implement a GraphQL resolver.

The orchestrator selects the task, starts the implementation subagent using Big Pickle, and passes it the relevant backend specification, OKF knowledge and NestJS skills.

Big Pickle implements the change in its own context, then returns a short report.

The orchestrator launches a tester using Nemotron Lightning to run the checks. If those checks fail, it launches another Big Pickle implementation session with the relevant failure evidence.

Once the required checks pass, the orchestrator updates OpenSpec task state and proceeds to the next ready task.

Because each subagent starts in a fresh child session, the main orchestrator does not need to retain the worker's entire conversation.

## 5. Additional settings I recommend

For your OpenSpec workflow, use `subagent_depth: 1` initially. This keeps delegation simple: the primary orchestrator can launch workers, but workers cannot independently start additional agents.

I would also restrict responsibilities through permissions:

- Planner and reviewer: read-only except explicitly authorized artifact writes.
- Implementer: allow relevant code changes, but restrict Git push and destructive commands.
- Tester: allow test commands and evidence output; don't allow production source edits.
- Orchestrator: control delegation, but require approval for merges and publishing.

OpenCode supports per-agent permissions for editing, shell commands, subagents and skill loading.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode



## 6. One practical limitation with free models

Even if all selected models are currently free, that doesn't necessarily mean unlimited use or consistent availability.

OpenCode describes several of them as limited-time free offerings. Some also have different provider data-handling arrangements. For private client repositories, review those terms before allowing an agent to send source code to a free hosted model.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://opencode.ai\&sz=32)

OpenCode



I would therefore keep a fallback model mapping and test the same set of OpenSpec tasks against two or three model combinations.

My recommendation for your first experiment: Nemotron Ultra for planning, Big Pickle for implementation, DeepSeek for independent review, and Nemotron Lightning for orchestration and routine validation. Run five representative tasks from a small project, measuring successful completions, retries, test results and model reliability.

Then use those results to decide whether Big Pickle should also handle planning or whether Nemotron/DeepSeek offer a meaningful advantage.

This lets you keep one OpenSpec workflow across Codex, Claude Code and OpenCode, with the model-to-role mapping changing by platform rather than changing the workflow itself.