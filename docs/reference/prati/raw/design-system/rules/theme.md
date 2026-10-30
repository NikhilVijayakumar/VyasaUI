# 🎨 Astra: Theme Logic & Visual Contract

> **Version:** 1.0.0
> **Status:** Mandatory Enforcement for Antigravity Agent Synthesis

## 1. The Multi-Mode Strategy

Astra mockups must support a **single-source, dual-output** theme model. The Agent uses semantic tokens, and the CSS foundations handle the value shifts.

* **Mode Switcher:** The `master.html` template provides a toggle that flips the `[data-theme]` attribute on the `<body>`.
* **Variable Inheritance:** All component styles must inherit from `var(--mui-...)`. Hardcoded Hex, RGB, or HSL values are strictly prohibited.

---

## 2. Surface & Elevation Logic

Following the MUI `surfaceOverrides`, the Agent must treat different layers of the UI with specific background logic:

| Surface Type | Light Mode Value | Dark Mode Value | MUI Mapping |
| --- | --- | --- | --- |
| **Default BG** | `palette.background.default` (`#F5F5F7`) | `palette.background.default` (`#0e1015`) | `palette.background.default` |
| **Paper/Card** | `palette.background.paper` (`#FFFFFF`) | `palette.background.paper` (`#16181D`) | `palette.background.paper` |
| **AppBar** | `palette.background.default` (`#F5F5F7`) | `palette.background.default` (`#0e1015`) | `MuiAppBar` Overrides |
| **Navigation** | `palette.background.paper` (`#FFFFFF`) | `palette.background.paper` (`#16181D`) | `MuiDrawer` Overrides |

> **Note:** In Dark Mode, `backgroundImage: 'none'` is mandatory for Paper and AppBar to prevent MUI's default elevation overlays from interfering with your custom palette.

---

## 3. Interaction & Feedback States

The Theme contract defines how the Agent renders state changes without JS:

* **Hover:** `filter: brightness(0.95)` for Light / `filter: brightness(1.1)` for Dark.
* **Active/Pressed:** `transform: scale(0.98)` for tactile feedback.
* **Disabled:** `opacity: 0.5` and `cursor: not-allowed`.
* **Dividers:** Must use `var(--mui-divider)`. In Dark mode, this is a subtle `Neutral 700/800`, never pure black.

---

## 4. Typography Integration

Theme logic extends to how text is rendered across modes:

* **Contrast Guardrail:** Text must always meet WCAG AA. If a primary color (e.g., `colors.primary`) is used as a background, the Agent must select the appropriate contrasting text color from the `metadata.json` specs.
* **Custom Variants:** Use the `hero` variant only for top-level dashboard metrics as defined in `foundations/typography.css`.

---

## 5. Metadata Hooks: `theme-metadata.json`

Every theme-specific mockup must include a metadata object for the **Verification Project**:

```json
{
  "theme_id": "agent-suite-v1",
  "active_mode": "dual (light/dark)",
  "overrides_applied": [
    "MuiAppBar-dark-flat",
    "MuiPaper-no-shadow",
    "MuiDrawer-border-right"
  ],
  "token_source": "foundations/colors.css"
}

```

---

## 6. Theme Templates (`/templates/theme`)

The Python Engine uses these to generate the visual environment:

1. **`template.css`**: The master CSS file containing the `:root` and `[data-theme]` selectors.
2. **`metadata.json`**: The contract defining which MUI components have custom overrides that the Agent must respect.

---

