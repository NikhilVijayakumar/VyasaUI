Yes. This is exactly the architecture I would recommend for your OpenSpec workflow: a persistent orchestrator with short-lived, isolated subagents for each task.

Both Codex and Claude Code support subagents with their own context windows. When a subagent finishes, it returns a result rather than its complete working history. This helps prevent the main session from becoming overloaded with implementation logs, test failures, file exploration and debugging.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://claude.com\&sz=32)

Claude by Anthropic+1



However, there is an important difference between isolating subagent context and ensuring the complete workflow stays manageable across hundreds of tasks.

## 1. The architecture you're describing

Persistent workflow orchestrator

Reads OpenSpec state · Selects next task · Delegates · Validates handoffs

Maintains only compact workflow context

Task 1.1

React agent

Fresh context

Complete

Task 1.2

NestJS agent

Fresh context

Complete

Task 1.3

DB agent

Fresh context

Complete

Persisted results, not conversation histories

OpenSpec task state · Git changes · Test evidence · Short execution summaries

Orchestrator selects next task

Launches another fresh subagent

The important part is that each implementation agent receives only what it needs:

- The assigned task and acceptance criteria.
- Relevant OpenSpec specifications and design.
- Necessary repository files and applicable skills.
- Any dependency outcomes or previous failure evidence.

It should not inherit the entire conversation history of every previous agent.

## 2. Context lifecycle for each task

| Component             | Context behavior                                        |
| --------------------- | ------------------------------------------------------- |
| Orchestrator          | Persistent but compact                                  |
| Task 1.1 implementer  | New isolated context                                    |
| Task 1.1 tester       | Separate isolated context                               |
| Task 1.1 repair agent | Fresh context with failure evidence                     |
| Task 1.2 implementer  | New isolated context                                    |
| Reviewer              | Fresh context with relevant Git diff and specifications |
| OpenSpec + Git        | Persist state outside LLM context                       |

The repair agent can be a fresh invocation of Terra, or the same Terra thread if the failure requires substantial ongoing investigation. For predictable context limits, I would prefer fresh invocations with concise diagnostic handoffs.

## 3. Example: one OpenSpec task execution

TASK BE-003 — Implement authentication endpoint

1. Coordinator — select task

   Reads task dependencies and determines BE-003 is ready.
2. Spawn Backend Agent — new context

   Receives BE-003, NestJS conventions, API contract and relevant source files. Implements the endpoint and unit tests.
3. Backend Agent returns

   A concise structured result with changed files, tests added, risks and status. Its exploration and implementation dialogue remain outside the coordinator's context.
4. Spawn Tester — new context

   Runs prescribed checks against the resulting code. Returns structured failures or success evidence.
5. Coordinator decides

   On failure, spawns a repair agent with the diagnostics. On success, records verification, marks BE-003 complete and finds the next ready task.

One detail matters: fresh context does not imply a fresh filesystem. Subagents may share the same working directory, which is useful for sequential implementation and testing, but risky when several agents edit the same files concurrently.

## 4. Will this completely solve the giant-context problem?

It solves most of the worker-context problem, but not automatically the orchestrator-context problem.

Imagine 100 tasks, each returning a 1,000-token summary. If the orchestrator accumulates all 100 responses, its own conversation can still become very large.

For that reason, I would introduce two levels of context management.

Worker isolation

Every task gets its own bounded agent context and returns a compact result.

Durable workflow state

The orchestrator reads current state from files or a controller instead of retaining full task history.

For particularly long projects, I would go one step further: allow the orchestrator itself to restart with a fresh context, reconstructing its state from OpenSpec, Git and a small execution-state file.

For example:

```

{
  "change_id": "authentication-api",
  "current_task": "BE-004",
  "completed_tasks": 3,
  "failed_tasks": 0,
  "branch": "feature/BE-001-authentication",
  "next_action": "implement",
  "assigned_agent": "backend-developer",
  "verification_status": "pending"
}

```

This is an illustrative state document. OpenSpec remains authoritative for specification and task completion; a separate execution store tracks operational details such as attempts, agent assignments and test results.

## 5. Can Codex and Claude Code do this natively?

| Capability                                  | Codex                             | Claude Code                       |
| ------------------------------------------- | --------------------------------- | --------------------------------- |
| Custom specialist agents                    | Yes                               | Yes                               |
| Separate subagent context                   | Yes                               | Yes                               |
| Return concise result to parent             | Yes                               | Yes                               |
| Different agent models                      | Supported in agent configuration  | Supported                         |
| Main agent coordinating workers             | Yes                               | Yes                               |
| Fresh worker for each task                  | Can be instructed                 | Can be instructed                 |
| Guaranteed task-state persistence           | Requires additional design        | Requires additional design        |
| Automatically restart orchestrator per task | Requires additional orchestration | Requires additional orchestration |

Claude's documentation specifically describes subagents starting in fresh context windows and returning results to the parent. Codex also provides isolated subagent threads.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://claude.com\&sz=32)

Claude by Anthropic+1



For deterministic, long-running workflows, a controller is more reliable than relying exclusively on an LLM to remember where it is. Anthropic also documents this distinction between agent-managed delegation and programmatic workflows.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://platform.claude.com\&sz=32)

Claude Cookbook



## 6. My proposed workflow policy

I would add the following rules to the shared agent-orchestration configuration:

```

orchestration:
  strategy: task-isolated
  source_of_truth: openspec

  coordinator:
    context_policy: compact
    responsibilities:
      - discover_next_task
      - select_agent
      - dispatch_task
      - verify_result
      - persist_state
      - advance_workflow

  workers:
    context_policy: fresh
    reuse_previous_task_context: false
    load:
      - assigned_task
      - relevant_specifications
      - relevant_design
      - required_skills
      - dependency_evidence

  handoff:
    format: structured
    include:
      - status
      - files_changed
      - tests_executed
      - evidence_paths
      - blockers
      - next_action

  verification:
    separate_agent: true
    max_repair_attempts: 3
    escalate_on_repeated_failure: true

  persistence:
    task_state: openspec
    operational_state: file
    preserve_full_worker_logs: true
    inject_full_logs_into_coordinator: false

```

This configuration is a design proposal that would need a small controller or orchestration skill to interpret it. It is not something OpenSpec executes natively.

## 7. One additional improvement I strongly recommend

Instead of running a single coordinator LLM for the entire project, use a deterministic workflow controller with a lightweight LLM coordinator only when reasoning is necessary.

That gives you this architecture:

Controller → Select task → Spawn specialist → Collect result → Run verification → Persist state → Repeat

The controller itself does not need a growing LLM conversation. It can use Python, OpenSpec CLI commands and structured JSON to manage the loop. A coordinator agent is invoked when it needs to resolve ambiguity, choose among specialists, interpret difficult failures or request architectural decisions.

This is especially suitable for your existing OpenSpec workflow because you already have well-defined artifact dependencies, tasks, verification scripts and Git conventions.

So yes: your idea is not only possible; isolating context at the task level is the direction I would choose. I would implement it initially with native Codex/Claude subagents, but design the execution state and handoff contracts so that a fully restartable Python controller can take over orchestration without changing your OpenSpec schemas.