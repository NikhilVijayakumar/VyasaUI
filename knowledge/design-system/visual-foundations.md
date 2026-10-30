---
type: Concept
title: Vyasa UI visual foundations
description: Theme, layout, typography, color and motion principles for the desktop interface.
status: draft
tags: [design-system, theme, tokens, typography, layout, motion]
---

# Visual language

Vyasa UI presents complex workspace information with clarity, restraint and consistent visual hierarchy. Typography, spacing, alignment and contrast should make information easy to scan. Decoration should not compete with content. Treat whitespace and predictable alignment as structural elements, while allowing sufficient density for useful desktop work.

# Tokens and themes

Use Prati's theme and exported design tokens for color, typography, spacing, shape and elevation. Use semantic palette roles rather than hardcoded colors in components. ThemeProvider wraps LanguageProvider at the application root; consumer providers belong inside them. Support light and dark themes consistently and verify legibility and interaction states in both. Product-specific brand overrides belong in the theme, not in individual components.

The source design guidance uses an eight-pixel spacing rhythm, neutral surfaces, restrained accents, subtle elevation and typography-led hierarchy. Apply those principles through the actual installed theme tokens; do not assume reference hex values, logo assets or font choices are Vyasa's approved brand.

For initial designs, prefer a comfortable desktop density and centralize any product-specific overrides in the theme. The default theme and final brand are open decisions. Test representative data-heavy views before adding a compact mode.

# Layout and motion

Layouts must adapt to the resizable Electron window, available display space and text scaling without clipping or obscuring primary actions. Choose density and navigation for desktop workflows rather than assuming a mobile layout. Motion communicates state changes or orientation and must respect reduced-motion preferences. Avoid motion that delays routine work.
