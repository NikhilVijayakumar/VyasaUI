---
type: Concept
title: Vyasa UI accessibility and localization
description: Inclusive desktop interaction, readable themes and language-ready presentation.
status: draft
tags: [design-system, accessibility, localization, keyboard]
---

# Accessibility

Use semantic elements, logical headings, associated form labels and accessible names. Interactive controls must work with a keyboard and show focus clearly. Announce meaningful asynchronous status changes appropriately. Do not rely on color alone for status. Verify text and controls against applicable contrast requirements in light and dark themes, and test zoom, text scaling and reduced motion. Favor comfortable target sizes and avoid clipped or overlapping content at smaller window sizes.

# Localization

Use Prati's LanguageProvider and translation dictionaries for interface text. Keep labels and messages separate from presentation, format dates and numbers for the selected locale, and allow text to expand without clipping. Prefer logical layout properties where practical so future right-to-left support can be added without rewriting layouts. Supported languages and any right-to-left commitment remain product decisions.

# Verification

Review representative screens using keyboard-only navigation and accessible names, inspect contrast in both themes, and exercise loading, error, empty and populated states. These practices guide implementation; they do not imply that the current placeholder has been verified.

Initial contrast targets are 4.5:1 for normal text and 3:1 for large text and applicable non-text controls, subject to the applicable standard and actual content. Record actual verification and exceptions; using a library component alone does not establish accessibility. Do not claim a language or right-to-left layout is supported until it has translations and has been tested.
