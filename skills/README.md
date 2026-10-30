# Project skills

The canonical skill files are under `skills/shared`, `skills/frontend`, and `skills/qa`. Use the skills relevant to the task and follow [AGENTS.md](../AGENTS.md), including the dependency ownership rule. Copied skills are maintained locally; they do not depend on the source repositories being present.

Run `python scripts/sync_skills.py` to create agent-facing references and `python scripts/sync_skills.py --verify` to check them. On Windows, Git checkouts without symlink support may require running the sync command after checkout; inspect `--dry-run` before replacing existing agent skills. The sync script does not manage the two older flat skill directories in `skills/`.
