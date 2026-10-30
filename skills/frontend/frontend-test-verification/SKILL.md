---
name: frontend-test-verification
description: Select and report evidence for frontend component and library changes.
metadata:
  scope: frontend
---

# frontend-test-verification

Map changed behavior to checks at the lowest useful layer. Prati uses Vitest and Testing Library; inspect scripts and tests before selecting commands. Assess public exports, relevant states, interaction, theme, localization and accessibility in proportion to impact. Use browser or assistive-technology checks when needed and available; do not claim they ran because a component test passed.

Record commands, actual outcomes, skipped checks and unverified scenarios. For visual checks record environment and affected components; distinguish automated evidence from human review. Do not weaken tests to make a change pass.
