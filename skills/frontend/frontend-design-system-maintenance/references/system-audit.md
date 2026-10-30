# Component audit and extension

Project adaptation informed by [Anthropic design-system](https://github.com/anthropics/knowledge-work-plugins/blob/main/design/skills/design-system/SKILL.md), reviewed 2026-10-22. Not a vendored upstream package.

For affected public exports, record:

| Component | Source provenance | Default/variants/sizes | Applicable states | Semantic roles | Individual docs | Verified consumers | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |

Check actual source and stories; mark each cell evidenced, missing or unverified. Identify naming drift and literals outside canonical tokens. Prioritize user impact and dependencies rather than inventing a numerical quality score.

For an extension, explain why existing composition is insufficient. Define its public contract and migration before code. Update the existing OpenSpec design/tasks and component inventory. Verify affected stories and screens afterward. Scope completion to the changed family without implying the entire system passed.

Before placing field actions or application identity in a feature, inspect existing controls and application chrome for reusable patterns. Explicitly assess password reveal, search/adornment actions, brand identity and language selection. If composition is missing, record a shared-control gap and choose the smallest reusable extension with caller-owned labels/value/ref/errors. A working feature-local button is not evidence that a reusable field contract was considered. Do not grow a general framework without demonstrated consumers.
