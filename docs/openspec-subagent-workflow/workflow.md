Yes. In fact, I would recommend making your multi-agent architecture extensible, so that you can add specialized subagents based on the repository's technology stack, installed skills, OpenSpec schema and current workflow stage.

Rather than limiting yourself to Planner, Implementer, Coordinator and Reviewer, you could have a dynamic agent catalog.

The important principle is:

Agents define who performs a task. Skills define how the task is performed. OpenSpec defines what must be delivered.

For example, a React + NestJS + GraphQL + PostgreSQL project could have dedicated React, NestJS, GraphQL, PostgreSQL and Playwright agents. An Unreal Engine project would use C++, Unreal Automation and asset-validation specialists instead.

## 1. Proposed agent architecture

OpenSpec Workflow Orchestrator

Resolves task dependencies, agent roles and required skills

Core workflow agents

Planner · Coordinator · Implementer · Reviewer · Tester

Available across every repository

Technology agents

React · NestJS · PostgreSQL · Unreal C++ · Python

Selected according to repo stack

Quality agents

Playwright · Security · Performance · Accessibility · API testing

Selected by verification needs

Operations agents

Git · CI/CD · Documentation · OpenSpec · Release

Selected by lifecycle activity

Shared skills and execution contracts

Reusable procedures, validation rules and handoff evidence

## 2. Example agent catalog

| Agent                | Specialized task                      | Suggested Claude model |
| -------------------- | ------------------------------------- | ---------------------- |
| Architect            | Architecture, design, ADRs            | Opus                   |
| Requirement analyst  | Requirement clarification and slicing | Opus                   |
| React developer      | React, TypeScript, UI                 | Sonnet                 |
| Backend developer    | NestJS, Python, API services          | Sonnet                 |
| Database specialist  | Schema, migrations, queries           | Sonnet                 |
| GraphQL specialist   | Schemas, resolvers, contracts         | Sonnet                 |
| Unreal developer     | UE C++, gameplay systems              | Sonnet                 |
| Test engineer        | Generate unit/integration tests       | Sonnet                 |
| Playwright tester    | Browser E2E automation                | Sonnet or Haiku        |
| Security reviewer    | Threats and implementation risks      | Opus or Sonnet         |
| Git coordinator      | Branches, commits, PR preparation     | Haiku                  |
| OpenSpec coordinator | Artifacts, task state, validation     | Haiku                  |
| CI/CD specialist     | Pipelines, build checks               | Sonnet                 |
| Documentation agent  | Technical documentation updates       | Haiku or Sonnet        |

You don't need to activate all these agents. Your framework should select the agents relevant to each project and task.

## 3. Agent selection based on repo and skills

I suggest maintaining an agent registry, with eligibility rules and skill dependencies. The following is a proposed configuration for your shared framework, not a native OpenSpec schema:

```

version: 1

agents:
  frontend-developer:
    role: implementation
    applies_when:
      stack: [react, typescript]
      task_tags: [frontend, ui]
    skills:
      - react-best-practices
      - typescript
      - ui-ux-pro-max
    models:
      claude: sonnet
      codex: default

  backend-developer:
    role: implementation
    applies_when:
      stack: [nestjs]
      task_tags: [backend, api]
    skills:
      - nestjs
      - api-design
    models:
      claude: sonnet
      codex: default

  playwright-tester:
    role: verification
    applies_when:
      task_tags: [e2e, browser]
      requires_skills: [playwright]
    skills:
      - playwright
      - test-verification
    models:
      claude: sonnet
      codex: default

  unreal-developer:
    role: implementation
    applies_when:
      stack: [unreal-engine]
      task_tags: [gameplay, cpp]
    skills:
      - unreal-cpp
      - unreal-testing
    models:
      claude: sonnet
      codex: default

```

The orchestrator follows a defined resolution process:

1. Read the repository profile and OpenSpec change.
2. Identify the next ready task and its tags.
3. Match eligible agents against the technology stack and available skills.
4. Select the most specific capable agent.
5. Execute the task, validate the result and update the workflow state.

Skills should be used to inform selection, but their presence alone should not cause an agent to run. For example, having a Playwright skill installed doesn't mean every backend task needs a Playwright agent.

## 4. How this works in Codex and Claude

Both platforms can support this architecture, although the registration and skill-loading mechanisms differ.

- Codex: Project agents live in `.codex/agents/*.toml`. Agents can inherit skills, and individual skills can be disabled through configuration. Codex also supports delegation instructions in `AGENTS.md` and skills.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://learn.chatgpt.com\&sz=32)

  ChatGPT Learn+1

- Claude Code: Project subagents live in `.claude/agents/*.md`. You can specify the agent's model, tools and skills to preload through its frontmatter.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://academy.claude.com\&sz=32)

  Claude Academy+2



Your shared registry can be the source from which platform-specific agent files are generated. That generator and the routing rules are components you would build yourself.

## 5. Avoid creating too many agents

I would use three levels:

| Level         | Purpose                        | Example                                     |
| ------------- | ------------------------------ | ------------------------------------------- |
| Core          | Always available               | Planner, Coordinator, Implementer, Reviewer |
| Repository    | Activated by tech stack        | React, NestJS, Unreal C++                   |
| Task-specific | Activated by actual task needs | Database migration, Playwright, Security    |

For a repository with 25 installed skills, you do not need 25 agents. One React agent can use several React, TypeScript, UI and accessibility skills. Create another agent only when separate expertise, isolation, permissions, model choice or independent review genuinely adds value.

Also, keep sequential implementation and test-repair cycles separate from parallel read-only analysis. Running multiple code-writing agents in the same working tree can cause conflicts.

## 6. How I would integrate this into your existing framework

Since you already have custom OpenSpec schemas, shared skills, team-specific schemas and validation scripts, I would introduce an additional agent orchestration module without altering the OpenSpec artifact format.

That module would own:

- `agent-registry.yaml` — available roles, capabilities, required skills and supported stacks.
- `agent-routing.yaml` — task-to-agent matching and fallback rules.
- `workflow-policy.yaml` — handoffs, retries, validation gates and escalation.
- `generate-agents.py` — generates platform-specific Codex and Claude Code configurations.
- `verify-agents.py` — validates agent references, skill availability, model mappings and workflow coverage.

I would also add a repository discovery step, where an agent inspects project structure, package manifests, OpenSpec configuration and skills before recommending which specialized agents should be enabled.

This fits particularly well with your Vyasa project inventory concept: Vyasa could eventually supply the discovered repository capabilities, while your OpenSpec framework remains responsible for execution and task coordination.

Final recommendation: Keep a small core group of orchestration agents, maintain an expandable catalog of specialist agents, and select the specialists dynamically based on the task, repo and skills. That gives you the same reusable OpenSpec workflow across React, NestJS, Python and Unreal projects without having to build a completely different agent system for each one.&#x20;