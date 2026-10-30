---
type: Concept
title: Vyasa UI components and interaction
description: Reusable Prati components, interaction states and Electron desktop behavior.
status: draft
tags: [design-system, components, interaction, electron]
---

# Components

Use Prati's public components and theme primitives. Compose Vyasa-specific screens and domain presentation from those public capabilities. When a reusable Prati component is missing or defective, fix the capability in Prati rather than building a replacement or compatibility workaround in Vyasa UI. Presentational components receive data and callbacks, while Astra ViewModel hooks orchestrate data and repositories handle access. The renderer does not implement Vyasa's discovery or detection rules.

# State and feedback

Provide clear default, hover, keyboard focus, pressed, selected and disabled states where applicable. Data workflows need meaningful loading, empty, success, partial and error feedback. Distinguish an empty result from an unavailable service, a stale observation or an incomplete scan. Label status in text or another accessible cue in addition to color. Preserve evidence and provenance when presenting project facts.

Show an understandable status and source cue for important facts, with detailed evidence available on demand. No matches, an unconfigured workspace, an empty index, a failed request and an unavailable backend require distinct explanations. Mockup examples should clearly identify sample data.

# Desktop interaction

Support keyboard navigation, visible focus, normal window resizing, zoom and scrolling. Provide accessible names for icon-only actions and use buttons for actions and links for navigation. Any privileged platform action crosses a narrow validated Electron boundary; display failures without exposing secrets. Shortcuts, native menus and window-specific controls require explicit product decisions before they are assumed.
