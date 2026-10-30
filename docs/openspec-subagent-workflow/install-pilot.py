"""Generate the repository-local pilot definitions, writing only files whose content changed."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ROLES = {
    'coordinator': ('gpt-6-luna', 'haiku', 'Track OpenSpec progress, prerequisites, handoffs and verification evidence. Do not mark tasks complete without evidence; do not guess dependencies. Report completed, active, blocked and next work.'),
    'planner': ('gpt-6.1-sol', 'opus', 'Analyze requirements and write bounded OpenSpec planning artifacts. Apply knowledge-first and identify ambiguity and ownership boundaries.'),
    'implementer': ('gpt-6.1-terra', 'sonnet', 'Implement the assigned bounded task, follow repository ownership, and report actual checks and failures. Do not silently alter requirements.'),
    'knowledge': ('gpt-6.1-terra', 'sonnet', 'Apply knowledge-first and maintain standalone OKF concepts using the target repository profile and validators. Never mark agent-written knowledge human-verified.'),
    'reviewer': ('gpt-6.1-sol', 'sonnet', 'Independently review the assigned change against requirements, risks and evidence. Report findings with locations; do not modify files.'),
}
COMMON = ('Read docs/openspec-subagent-workflow/role-and-handoff-contract.md and applicable repository instructions and skills. '
          'Respect user authorization and harness permissions. Preserve unrelated changes. Return task ID, status, files, actual checks, evidence, blockers and next action. '
          'OpenSpec is authoritative for delivery; knowledge remains independent. One implementation writer per working tree.')
# Reviewer isolation is declarative per harness. Shell access stays because a review needs git diff;
# a reviewer can still write through the shell.
OPENCODE_REVIEWER = 'permissions:\n  - action: edit\n    resource: "*"\n    effect: deny\n'
CLAUDE_REVIEWER = 'tools: Read, Grep, Glob, Bash\n'
CODEX_REVIEWER = 'sandbox_mode = "read-only"\napproval_policy = "never"\n'

def put(path: Path, content: str) -> str:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding='utf-8') == content:
        return 'unchanged'
    path.write_text(content, encoding='utf-8')
    return 'written'

config = []
for role, (codex_model, claude_model, description) in ROLES.items():
    prompt = COMMON + ' ' + description
    config.append(f'[agents.vyasa_{role}]\ndescription = "{description}"\nconfig_file = "agents/vyasa-{role}.toml"\n')
    put(ROOT / '.codex/agents' / f'vyasa-{role}.toml',
        f'model = "{codex_model}"\n{CODEX_REVIEWER if role == "reviewer" else ""}developer_instructions = """{prompt}"""\n')
    put(ROOT / '.claude/agents' / f'vyasa-{role}.md',
        f'---\nname: vyasa-{role}\ndescription: "{description}"\nmodel: {claude_model}\n{CLAUDE_REVIEWER if role == "reviewer" else ""}---\n\n{prompt}\n')
    put(ROOT / '.opencode/agents' / f'vyasa-{role}.md',
        f'---\ndescription: "{description}"\nmode: subagent\n{OPENCODE_REVIEWER if role == "reviewer" else ""}---\n\n{prompt}\n')
put(ROOT / '.codex/config.toml', '\n'.join(config))
print('Pilot definitions are current.')
