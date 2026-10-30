---
type: Concept
title: Vyasa UI product and architecture
description: Purpose and initial boundaries of the Vyasa desktop interface.
status: draft
tags: [product, architecture, electron]
---

# Purpose

Vyasa UI is intended as a desktop interface for Vyasa, a local-first workspace intelligence MCP server. Its initial shell is a starting point for a future mockup.

# Boundaries

Electron owns the desktop lifecycle. The React renderer uses Prati for design components and Astra for application state and MVVM patterns. Vyasa is a separate Python application; its connection, process ownership, and supported workflows remain to be designed. The renderer has no direct Node.js access.
