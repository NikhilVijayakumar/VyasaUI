# ♿ Astra: Accessibility & Inclusive Design Standards

> **Version:** 1.0.0
> **Status:** Mandatory Enforcement for Antigravity Agent Synthesis

## 1. Semantic HTML Structure

The Agent must use meaningful HTML elements over generic `<div>` tags to ensure screen reader compatibility.

* **Landmarks:** Every Page template must include `<header>`, `<main>`, `<nav>`, and `<footer>`.
* **Headings:** Must follow a logical nesting order ($H1 \to H2 \to H3$). Jumping levels (e.g., $H2$ to $H4$) is prohibited.
* **Buttons vs. Links:** * Use `<button>` for actions (e.g., "Save," "Open Menu").
* Use `<a>` for navigation to different pages or external URLs.



---

## 2. Color Contrast & Visual Clarity

Based on the `mui-tokens.md`, the Agent must ensure all text-to-background combinations meet the minimum contrast ratio of **4.5:1**.

* **Standard Text:** Must use `--mui-text-primary` on `--mui-bg-default`.
* **Secondary Text:** Must use `--mui-text-secondary` only when the contrast audit passes.
* **Dark Mode Specifics:** * Primary colors must shift (e.g., `colors.primary`) to maintain readability against dark backgrounds.
* No "Pure Black" (#000) backgrounds; use the Neutral 900+ range defined in `colors.ts` to reduce eye strain.



---

## 3. Interactive Targets & States

To support users with motor impairments (and mobile viewports), the following rules apply:

* **Touch Targets:** All interactive elements (Buttons, Menu Items, Icons) must have a minimum hit area of **44x44px**.
* **Focus Indicators:** The Agent must include a visible `:focus-visible` state for all interactive atoms. Use `:focus-visible` (not `:focus`) to suppress the outline on mouse clicks while preserving it for keyboard navigation.
* *Rule:* Use `outline: 2px solid var(--mui-primary-main)` with an `outline-offset` of 2px and `border-radius: inherit`.


* **State Labeling:** If an element is expanded or selected, the Agent must inject `aria-expanded="true"` or `aria-selected="true"`.

---

## 4. ARIA & Metadata Hooks

The Agent must populate specific attributes in the `markup.html` to allow for NLP-based verification.

| Element | Required Attribute | Purpose |
| --- | --- | --- |
| **Icons** | `aria-hidden="true"` | If purely decorative. |
| **Action Icons** | `aria-label="[Intent]"` | If the icon performs a function without text. |
| **Status Indicators** | `role="status"` | For live updates like "Agent Online/Offline." |
| **Form Inputs** | `aria-labelledby="[ID]"` | Ensures labels are correctly associated with inputs. |

---

## 5. Typography & Readability

* **Fluid Scaling:** Rely strictly on the `clamp()` logic in `typography.css`. Never use `px` for font sizes; use `rem` to honor the user's browser zoom settings.
* **Line Height:** * Body text must have a minimum `line-height` of **1.5**.
* Header text must have a minimum `line-height` of **1.2**.


* **Text Overlays:** Text placed over images or gradients must have a semi-transparent scrim/overlay (minimum 40% opacity) to ensure legibility.

---

## 6. Verification Project Integration

To assist the separate Verification Project, the Agent must inject the following:

* **`data-a11y-role`**: Explicitly state the intended role (e.g., `data-a11y-role="tablist"`).
* **`data-a11y-intent`**: Describe the purpose of a complex molecule (e.g., `data-a11y-intent="navigation-tree"`).

---
