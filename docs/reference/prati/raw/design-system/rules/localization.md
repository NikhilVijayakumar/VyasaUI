# 🌍 Astra: Localization (L10n) & Internationalization (i18n)

> **Version:** 1.0.0
> **Status:** Mandatory Enforcement for Antigravity Agent Synthesis

## 1. Zero Hardcoding Policy

The Antigravity Agent is strictly forbidden from placing literal strings (e.g., "Submit") directly into the `markup.html`.

* **The Slot Rule:** All text nodes must use a Handlebars-style placeholder: `{{t 'namespace.key'}}`.
* **The JSON Rule:** The actual values for these placeholders must be stored in the feature's `locals/` directory (e.g., `en.json`, `ml.json`, `hi.json`).

---

## 2. Localized Data Structure

For every feature discovered by the Python Engine, the following structure must be maintained in the `output` directory:

```text
/FeatureName
└── /locals
    ├── en.json (Source of Truth)
    ├── ml.json (Malayalam)
    └── hi.json (Hindi)

```

### **Example `en.json` Contract:**

```json
{
  "agent_health": {
    "title": "Agent Health Monitor",
    "status_online": "Online",
    "status_offline": "Offline",
    "last_seen": "Last seen: {{time}} ago"
  }
}

```

---

## 3. Directionality & Layout (RTL/LTR)

While the current project focuses on LTR (Left-to-Right) languages, the Agent must prepare for RTL (Right-to-Left) compatibility:

* **Logical Properties:** Use CSS Logical Properties in templates instead of physical ones.
* *Avoid:* `margin-left: 16px;`
* *Use:* `margin-inline-start: var(--mui-spacing-2);`


* **Mirroring:** The **Verification Project** will check for layout mirroring if the `metadata.json` flag `rtl_supported` is set to `true`.

---

## 4. Typography Constraints for Indic Scripts

When synthesizing for Malayalam (`ml`) or Hindi (`hi`), the Agent must adjust the typography foundation via the `metadata.json`:

* **Line Height:** Indic scripts often require a $10\%-20\%$ increase in `line-height` compared to Latin scripts to prevent character clipping.
* **Font Weight:** Avoid ultra-thin weights (under `400`) for non-Latin scripts as they often lose legibility on high-density displays.

---

## 5. Variable Injection in Strings

Localized strings often contain dynamic data. The Agent must use standardized tokens for these:

* **Dates/Time:** `{{date}}`, `{{time}}`, `{{relative_time}}`.
* **Counters:** `{{count}}` (The Agent must provide pluralization keys: `one`, `other`).
* **Example:**
```json
"notifications": {
  "one": "You have 1 new alert",
  "other": "You have {{count}} new alerts"
}

```



---

## 6. Verification Anchor: `data-l10n`

To assist the **Verification Project**, the Agent must tag every localized element in the HTML:

* **Attribute:** `data-l10n="namespace.key"`
* **Purpose:** Allows the NLP auditor to cross-reference the rendered text in the mockup against the JSON file and the original feature documentation.

---

## 7. Localization × Accessibility

Localization changes can introduce accessibility regressions. These rules apply whenever locale-specific content is rendered.

### RTL + Screen Reader Behavior

* Set `dir="rtl"` on `<html>` — not on individual elements. Screen readers use this to announce reading direction.
* Never apply `dir` via CSS `direction` property alone — screen readers do not read CSS.
* Landmark elements (`<nav>`, `<aside>`, `<header>`) must remain semantically correct in RTL. Their visual mirroring does not change their ARIA role.
* Icon-only buttons: when icons are mirrored (`transform: scaleX(-1)`), `aria-label` must still describe the intent in the active locale language.

### Indic Script Contrast

* Malayalam (`ml`) and Hindi (`hi`) scripts have denser glyph structures. Text at the minimum 4.5:1 contrast ratio may appear visually heavier — verify contrast visually at target font weight, not just via automated tools.
* Avoid font weights below `400` for Indic scripts on dark surfaces — thin strokes lose legibility at small sizes.
* Minimum `line-height: 1.7` for Indic body text (versus 1.5 for Latin) to prevent ascender/descender clipping that obscures characters used for screen reader pronunciation.

### Text Expansion + Layout Reflow

* German, Finnish, and other expansion-heavy languages can expand strings by 30–40%. Ensure interactive elements (buttons, tabs, labels) do not clip or truncate — this hides content from screen readers.
* Use `overflow: visible` or proper wrapping on elements that receive localized text. Clipped text is not announced by screen readers.

### lang Attribute

* Always set `lang` attribute on `<html>` to the active locale code (`en`, `ml`, `hi`, etc.).
* Screen readers use `lang` to switch pronunciation engines. Without it, assistive technology reads Malayalam text with English phoneme rules — unintelligible output.
* For inline multilingual content (e.g., a product name in English within a Malayalam page), use `lang` on the specific element: `<span lang="en">Astra</span>`.

### Focus and Keyboard in RTL

* Tab order in RTL should follow visual reading order (right-to-left). Verify that DOM order matches the RTL layout.
* Focus ring direction is inherited from the layout — no special handling needed if CSS logical properties are used correctly.

---

